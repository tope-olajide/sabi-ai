"use client";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import NextAppDirEmotionCacheProvider from "./EmotionCache";
import { darkTheme, lightTheme } from "./theme";
import { ReactNode, createContext, useMemo, useState, useEffect } from "react";
import Loader from "../Loader";

export const ColorModeContext = createContext({ toggleColorMode: () => {} });

export default function ThemeRegistry({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<string>("dark");
  const [isClient, setIsClient] = useState(false);
  // Use useEffect to get the theme mode from localStorage when the component mounts
  useEffect(() => {
    const currentMode = localStorage.getItem("currentMode");
    setIsClient(true);
    if (currentMode) {
      setMode(currentMode);
    }
  }, []);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          const newMode = prevMode === "light" ? "dark" : "light";
          localStorage.setItem("currentMode", newMode);
          return newMode;
        });
      },
    }),
    []
  );
  if (!isClient) {
    return <Loader />;
  }

  return (
    <ColorModeContext.Provider value={colorMode}>
      <NextAppDirEmotionCacheProvider options={{ key: "mui" }}>
        <ThemeProvider theme={mode === "light" ? lightTheme : darkTheme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </NextAppDirEmotionCacheProvider>
    </ColorModeContext.Provider>
  );
}

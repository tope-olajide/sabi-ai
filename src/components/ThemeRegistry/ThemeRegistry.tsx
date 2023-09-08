"use client";

import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import NextAppDirEmotionCacheProvider from "./EmotionCache";
import { darkTheme, lightTheme } from "./theme";
import { ReactNode, createContext, useMemo, useState } from "react";
import { ModifierFlags } from "typescript";

 export const ColorModeContext = createContext({ toggleColorMode: () => {} });

export default function ThemeRegistry({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<"light" | "dark">("light");
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );
    return (
        <ColorModeContext.Provider value={colorMode}>
    <NextAppDirEmotionCacheProvider options={{ key: "mui" }}>
      <ThemeProvider theme={mode === "light" ? lightTheme : darkTheme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        {children}
      </ThemeProvider>
            </NextAppDirEmotionCacheProvider>
            </ColorModeContext.Provider>
  );
}

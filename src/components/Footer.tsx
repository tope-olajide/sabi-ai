"use client";
import AppBar from "@mui/material/AppBar";
import Link from "@mui/material/Link";
import { useTheme } from "@mui/material/styles";

const Footer = () => {
  const theme = useTheme();
  return (
    <>
      <AppBar
        position="static"
        elevation={2}
        sx={{
          width: "100%",
          minHeight: "70px",
          backgroundColor: theme.palette.mode === "light" ? "#fff" : "#0D1117",
          bottom: 0,
          top: "auto",
          color: theme.palette.mode === "light" ? "#000" : "fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 0,
        }}
      >
        <h5>Made with love by <Link href="https://github.com/tope-olajide/">Temitope.js</Link></h5>
      </AppBar>
    </>
  );
};
export default Footer;

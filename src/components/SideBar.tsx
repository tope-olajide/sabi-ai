
"use client";

import * as React from "react";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import CloseIcon from "@mui/icons-material/Close";
import SpellcheckIcon from "@mui/icons-material/Spellcheck";
import EditNoteIcon from "@mui/icons-material/EditNote";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import Translate from "@mui/icons-material/Translate";
import ShortTextIcon from "@mui/icons-material/ShortText";
import AccountIcon from "@mui/icons-material/AccountCircle";
import Link from "@mui/material/Link";
import MobileNav from "./MobileNav";
import EngineeringOutlinedIcon from '@mui/icons-material/EngineeringOutlined';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useContext } from "react";
import { ColorModeContext } from "./ThemeRegistry/ThemeRegistry";





const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function SideBar({ children, pageTitle }:any) {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const toggleSideBar = () => {
    setOpen(!open);
  };
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed">
        <Toolbar>
          
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Box sx={{display:'flex', alignItems:'center'}}>
              <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={toggleSideBar}
            edge="start"
            sx={{
              marginRight: 3,
              display: { xs: 'none', sm: 'none', md:'block', lg:'block',xl:'block', xxl:'block' } 
            }}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
              </IconButton>
              <Box sx={{display:'flex', alignItems:'center'}}><EngineeringOutlinedIcon />
<Typography variant="h6" component="div">
           Sability AI
              </Typography>
              </Box>
          
              
            </Box>
            

            <Typography noWrap component="p" sx={{ fontWeight: 600,display: { xs: 'none', sm: 'none', md:'block', lg:'block',xl:'block', xxl:'block' } }}>
              {pageTitle}
            </Typography>

            <Box>
            {theme.palette.mode} mode
      <IconButton sx={{ ml: 1 }} onClick={colorMode.toggleColorMode} color="inherit">
        {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
      
      <Drawer variant="permanent" open={open} sx={{
         display: { xs: 'none', sm: 'none', md:'block', lg:'block',xl:'block', xxl:'block' } 
      }}>
        <DrawerHeader></DrawerHeader>
        <Divider />
        <List>
          {[
            "Grammar Checker",
            "Paraphraser",
            "Summarizer",
            "Translator",
            "Content Generator",
          ].map((text, index) => (
            <ListItem key={text} disablePadding sx={{ display: "block" }}>
              <Link
                underline="none"
                href={index == 0 ? "/" : index == 1 ? "/paraphraser": index == 2 ? "/summarize": index == 3 ? "/translate" : "/generate-content"}
              >
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    {index == 0 ? (
                      <SpellcheckIcon />
                    ) : index == 1 ? (
                      <HistoryEduIcon />
                    ) : index == 2 ? (
                      <ShortTextIcon />
                    ) : index == 3 ? (
                      <Translate />
                    ) : (
                      <EditNoteIcon />
                    )}
                  </ListItemIcon>
                  <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
              </Link>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List sx={{ mt: 25 }}>
          <Divider />
          {["Account"].map((text, index) => (
            <ListItem key={text} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  {<AccountIcon />}
                </ListItemIcon>
                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      
      <Box component="main" sx={{ flexGrow: 1, p: 0 }}>
        <Toolbar />
        <section  className="mobile-nav-container">
          <MobileNav pageTitle={pageTitle} />
       </section>
          
    
        
        {children}
      </Box>
    </Box>
  );
}

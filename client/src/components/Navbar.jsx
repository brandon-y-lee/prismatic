import React, { useState } from "react";
import { Menu as MenuIcon, Search, SettingsOutlined } from "@mui/icons-material";
import ChatIcon from '@mui/icons-material/Chat';
import { AppBar, Avatar, IconButton, InputBase, Toolbar, Menu, MenuItem, Fab, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "state/api";
import { removeToken, removeLoggedInUser, removeAccessToken, removeLocalRequisitionId } from "utils/token";

import FlexBetween from "components/FlexBetween";
import ChatBox from "components/ChatBox";

const Navbar = ({ user, isSidebarOpen, setIsSidebarOpen }) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();

  const toggleChat = () => {
    setChatOpen(!chatOpen);
  }

  const handleMenuOpen = (event) => { setAnchorEl(event.currentTarget) };
  const handleMenuClose = () => { setAnchorEl(null) };

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      removeToken();
      removeLoggedInUser();
      removeAccessToken();
      removeLocalRequisitionId();
      navigate('/login');
      window.location.reload();
    } catch (error) {
      console.error("Logout error: ", error);
    }
  };

  return (
    <AppBar
      sx={{
        position: "static",
        background: "none",
        boxShadow: "none",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* LEFT SIDE */}
        <FlexBetween>
          <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <MenuIcon />
          </IconButton>
          <FlexBetween
            backgroundColor={theme.palette.background.alt}
            borderRadius="9px"
            gap="3rem"
            p="0.1rem 1.5rem"
          >
            <InputBase placeholder="Search..." />
            <IconButton>
              <Search />
            </IconButton>
          </FlexBetween>
        </FlexBetween>

        {/* RIGHT SIDE */}
        <FlexBetween gap="1.5rem">
          <Fab 
            color="primary" 
            onClick={toggleChat} 
            sx={{ position: 'fixed', bottom: 16, right: 16 }}>
            <ChatIcon />
          </Fab>
          <IconButton>
            <SettingsOutlined sx={{ fontSize: "25px" }} />
          </IconButton>
          <IconButton
            size="small"
            edge="end"
            color="inherit"
            aria-label="user-avatar"
            onClick={handleMenuOpen}
          >
            <Avatar />
          </IconButton>
          <Menu
            id="user-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
          >
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </FlexBetween>
      </Toolbar>
      <ChatBox open={chatOpen} onClose={toggleChat} />
    </AppBar>
  );
};

export default Navbar;


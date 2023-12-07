import React, { useState } from "react";
import { AppBar, Box, Toolbar, IconButton, Menu, MenuItem, Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "state/api";
import { removeToken, removeLoggedInUser } from "utils/token";


const GlobalHeader = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [logout] = useLogoutMutation();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      removeToken();
      removeLoggedInUser();
      navigate("/login");
    } catch (error) {
      console.error("Logout error: ", error);
    }
  };

  return (
    <AppBar position="static" color="default" sx={{ boxShadow: 0 }}>
      <Toolbar>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton
          size="large"
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
      </Toolbar>
    </AppBar>
  );
};

export default GlobalHeader;
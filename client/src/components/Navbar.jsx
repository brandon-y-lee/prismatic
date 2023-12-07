import React, { useState } from "react";
import { Menu as MenuIcon, Search, SettingsOutlined } from "@mui/icons-material";
import FlexBetween from "components/FlexBetween";
import { AppBar, Avatar, IconButton, InputBase, Toolbar, Menu, MenuItem, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "state/api";
import { removeToken, removeLoggedInUser } from "utils/token";

const Navbar = ({ user, isSidebarOpen, setIsSidebarOpen }) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();

  const handleMenuOpen = (event) => { setAnchorEl(event.currentTarget) };
  const handleMenuClose = () => { setAnchorEl(null) };

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      removeToken();
      removeLoggedInUser();
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
    </AppBar>
  );
};

export default Navbar;


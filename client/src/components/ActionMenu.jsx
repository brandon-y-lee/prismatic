import React, { useState } from "react";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { 
  Menu,
  MenuItem,
  IconButton
} from '@mui/material';

const ActionMenu = ({ data, onView, onUpdate, onDelete }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleView = () => {
    handleClose();
    onView(data._id);
  };

  const handleUpdate = () => {
    handleClose();
    onUpdate(data._id);
  };

  const handleDelete = () => {
    handleClose();
    onDelete(data._id);
  }
  
  return (
    <div>
      <IconButton
        variant="contained"
        color= "primary"
        onClick={handleClick}
      >
        <MoreHorizIcon color="action" />
      </IconButton>
      <Menu
        id="actions-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handleView}>View</MenuItem>
        <MenuItem onClick={handleUpdate}>Update</MenuItem>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu>
    </div>
  );
};

export default ActionMenu;

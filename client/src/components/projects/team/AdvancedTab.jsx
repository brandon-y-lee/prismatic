import React, { useState } from 'react';
import {
  TextField, 
  Box, 
  List, 
  ListItem, 
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  MenuItem,
  Select,
  InputLabel,
  FormControl
} from "@mui/material";
import { MoreVertOutlined } from '@mui/icons-material';

const AdvancedTab = ({ open, onClose, teamMembers }) => {
  const [email, setEmail] = useState('');

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  return (
    <Box>
      <TextField
        autoFocus
        margin="dense"
        id="email"
        label="Add team members by name or email..."
        type="email"
        fullWidth
        variant="outlined"
        value={email}
        onChange={handleEmailChange}
      />

      <List dense>
        {teamMembers.map((member, index) => (
          <ListItem key={index} secondaryAction={
            <IconButton edge="end">
              <MoreVertOutlined />
            </IconButton>
          }>
            <ListItemAvatar>
              <Avatar {...stringAvatar(member.name)} />
            </ListItemAvatar>
            <ListItemText
              primary={member.name}
              secondary={member.email}
            />
            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="role-select-label">Role</InputLabel>
              <Select
                labelId="role-select-label"
                id="role-select"
                value={member.role}
                label="Role"
                // onChange={handleRoleChange}
              >
                <MenuItem value="Member">Member</MenuItem>
                <MenuItem value="Admin">Admin</MenuItem>
                {/* More roles here */}
              </Select>
            </FormControl>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

function stringAvatar(name) {
  return {
    children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
  };
}

export default AdvancedTab;


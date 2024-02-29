import React, { useState } from 'react';
import {
  TextField, 
  Button, 
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
  FormControl,
  Typography
} from "@mui/material";
import { MoreVertOutlined } from '@mui/icons-material';
import FlexBetween from 'components/FlexBetween';

const MemberTab = ({ onClose, teamMembers }) => {
  const [email, setEmail] = useState('');

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = () => {
    onClose();
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', my: 2, mx: 1 }}>
        <Typography variant='h6' fontWeight='550'>Invite to Team</Typography>
        <FlexBetween sx={{ gap: 1.5, mt: 1 }}>
          <TextField
            variant="outlined"
            size="small"
            id="email"
            label="Add team members by name or email..."
            type="email"
            autoComplete='off'
            fullWidth
            value={email}
            onChange={handleEmailChange}
          />
          <Button 
            variant='outlined'
            color='info'
            onClick={handleSubmit}
            sx={{ py: '4px' }}
          >Invite</Button>
        </FlexBetween>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', my: 2, mx: 1 }}>
        <Typography variant='h6' fontWeight='550'>Team Members</Typography>
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
                primary={<Typography sx={{ fontWeight: '550' }}>{member.name}</Typography>}
                secondary={member.role}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};

function stringAvatar(name) {
  return {
    children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
  };
}

export default MemberTab;


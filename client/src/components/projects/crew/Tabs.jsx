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
  Typography
} from "@mui/material";
import { MoreVertOutlined } from '@mui/icons-material';
import FlexBetween from 'components/FlexBetween';

export const GeneralTab = () => {
  const [teamName, setTeamName] = useState('');
  const [description, setDescription] = useState('');

  const handleTeamNameChange = (event) => {
    setTeamName(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', my: 2, mx: 1 }}>
        <Typography variant='h6'>Project</Typography>
        <Typography variant='h6' sx={{ fontWeight: 550 }}>Test</Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', my: 3, mx: 1 }}>
        <Typography variant='body1'>Team name</Typography>
        <TextField
          variant="outlined"
          size="small"
          margin="dense"
          id="team"
          fullWidth
          value={teamName}
          onChange={handleTeamNameChange}
        />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', my: 2, mx: 1 }}>
        <Typography variant='body1'>Description</Typography>
        <TextField
          variant="outlined"
          size="small"
          margin="dense"
          id="team"
          rows={4}
          multiline
          fullWidth
          value={description}
          onChange={handleDescriptionChange}
        />
      </Box>
    </Box>
  );
};

export const MemberTab = ({ onClose, crewMembers }) => {
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
          {crewMembers.map((member, index) => (
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

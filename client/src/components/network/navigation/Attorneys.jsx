import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Button,
  Paper,
  Typography,
  useTheme,
} from '@mui/material';
import FlexBetween from 'components/FlexBetween';

const invitationsData = [
  {
    id: 1,
    name: 'Erika Mahterian',
    event: 'Consulting Week 2024',
    date: 'Mon, Apr 15, 3:00 PM',
    avatarUrl: 'avatar1.jpg', // Replace with actual avatar URLs
  },
  {
    id: 2,
    name: 'Yan. Soros',
    event: 'A Maturity Model to Secure Mulesoft Environments',
    date: 'Wed, Apr 17, 10:00 AM',
    avatarUrl: 'avatar2.jpg',
  },
  // ... more invitations
];

const Attorneys = () => {
  const theme = useTheme();

  const handleAccept = (id) => {
    console.log('Accepted invitation:', id);
    // Implementation to handle acceptance
  };

  const handleIgnore = (id) => {
    console.log('Ignored invitation:', id);
    // Implementation to handle ignore
  };

  return (
    <Paper
      sx={{
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'none',
        borderColor: 'grey.300',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderRadius: '16px',
        m: '1.5rem 2.5rem'
      }}
    >
      <FlexBetween sx={{ p: '0.75rem 1rem', borderBottom: '1px solid', borderColor: 'grey.300' }}>
        <Typography variant='h5' sx={{ fontWeight: '550' }}>
          Attorneys
        </Typography>
        <Button variant='text' color='inherit' size="small">View all</Button>
      </FlexBetween>
      <List>
        {invitationsData.map((invite) => (
          <ListItem key={invite.id} sx={{ alignItems: 'center' }}>
            <ListItemAvatar>
              <Avatar src={invite.avatarUrl} />
            </ListItemAvatar>
            <ListItemText
              primary={invite.event}
              secondary={
                <>
                  <Typography component="span" variant="body2" color="text.primary">
                    {invite.name}
                  </Typography>
                  {` — ${invite.date}`}
                </>
              }
            />
            <Box sx={{ ml: 'auto', textAlign: 'right' }}>
              <Button variant="text" color='inherit' sx={{ mr: 1 }} onClick={() => handleIgnore(invite.id)}>
                Ignore
              </Button>
              <Button variant="outlined" color='info' onClick={() => handleAccept(invite.id)} sx={{ borderRadius: '20px' }}>
                Accept
              </Button>
            </Box>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default Attorneys;

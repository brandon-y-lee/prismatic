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
  CircularProgress,
} from '@mui/material';
import FlexBetween from 'components/FlexBetween';
import { useGetInvitesReceivedQuery } from 'state/api';
import userEvent from '@testing-library/user-event';
import { getLoggedInUser } from 'utils/token';
import { formatDate } from 'utils/network';

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

const Invitations = () => {
  const theme = useTheme();
  const user = getLoggedInUser();

  const { data: invitesReceived, isLoading: isInvitesLoading, isError } = useGetInvitesReceivedQuery({ userId: user.userId }, { skip: !user });
  console.log('invites received at Invitations: ', invitesReceived);
  
  const handleAccept = (id) => {
    console.log('Accepted invitation:', id);
    // Implementation to handle acceptance
  };

  const handleIgnore = (id) => {
    console.log('Ignored invitation:', id);
    // Implementation to handle ignore
  };

  if (isInvitesLoading) {
    return <CircularProgress />;
  }

  if (isError) {
    return <Typography>Failed to load invitations.</Typography>;
  }

  return (
    <Paper
      sx={{
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'none',
        borderColor: 'grey.300',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderRadius: '16px'
      }}
    >
      <FlexBetween sx={{ p: '0.75rem 1rem', borderBottom: '1px solid', borderColor: 'grey.300' }}>
        <Typography variant='h5'>
          Invitations
        </Typography>
        <Button variant='text' color='inherit' size="small">View all</Button>
      </FlexBetween>
      <List>
        {invitesReceived.length > 0 ? (
          invitesReceived.map((invite) => (
            <ListItem key={invite.id} sx={{ alignItems: 'center', gap: '0.5rem' }}>
              <ListItemAvatar>
                <Avatar src={invite.avatarUrl} sx={{ width: 48, height: 48 }} />
              </ListItemAvatar>
              <ListItemText
                primary={invite.sender.name}
                secondary={
                  <>
                    <Typography component="span" variant="body2" color="text.primary">
                      {invite.sender.description}
                    </Typography>
                  </>
                }
                primaryTypographyProps={{ variant: 'h6', fontWeight: '550' }}
              />
              <Box sx={{ ml: 'auto', textAlign: 'right' }}>
                <Button variant="text" color='inherit' sx={{ borderRadius: '20px', mr: 1 }} onClick={() => handleIgnore(invite.id)}>
                  Ignore
                </Button>
                <Button variant="outlined" color='info' onClick={() => handleAccept(invite.id)} sx={{ borderRadius: '20px' }}>
                  Accept
                </Button>
              </Box>
            </ListItem>
          ))
        ) : (
          <Typography sx={{ p: 2 }}>No invitations received.</Typography>
        )}
      </List>
    </Paper>
  );
};

export default Invitations;

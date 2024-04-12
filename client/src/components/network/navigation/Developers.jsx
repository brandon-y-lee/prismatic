import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Button,
  IconButton,
  Paper,
  Typography,
  useTheme,
} from '@mui/material';
import { MoreHorizOutlined } from '@mui/icons-material';
import FlexBetween from 'components/FlexBetween';
import { getLoggedInUser } from 'utils/token';
import { formatDate } from 'utils/network';

const invitationsData = [
  {
    id: 1,
    name: 'Erika Mahterian',
    description: 'Developer',
    date: 'Mon, Apr 15, 3:00 PM',
    avatarUrl: 'avatar1.jpg',
  },
  {
    id: 2,
    name: 'Yan. Soros',
    description: 'Real Estate Developer',
    date: 'Wed, Apr 17, 10:00 AM',
    avatarUrl: 'avatar2.jpg',
  },
];

const Developers = () => {
  const theme = useTheme();
  const user = getLoggedInUser();

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
      <FlexBetween sx={{ p: '1rem', borderBottom: '1px solid', borderColor: 'grey.300' }}>
        <Typography sx={{ fontSize: '18px' }}>
          2 Developers
        </Typography>
      </FlexBetween>
      <List>
        {invitationsData.map((invite) => (
          <ListItem key={invite.id} sx={{ alignItems: 'center', gap: '1rem' }}>
            <ListItemAvatar>
              <Avatar src={invite.avatarUrl} sx={{ width: 68, height: 68 }} />
            </ListItemAvatar>
            <ListItemText
              primary={invite.name}
              secondary={
                <>
                  <Typography component="span" variant="body1" color="textPrimary">
                    {invite.description}
                  </Typography>
                  <br />
                  <Typography component="span" variant="body2" color="textSecondary">
                    {formatDate(invite.date)}
                  </Typography>
                </>
              }
              primaryTypographyProps={{ variant: 'h5', fontWeight: '550' }}
            />
            <Box sx={{ ml: 'auto', textAlign: 'right', display: 'flex', alignItems: 'center' }}>
              <Button variant="outlined" color='info' sx={{ borderRadius: '20px', mr: 1 }}>
                Message
              </Button>
              <IconButton>
                <MoreHorizOutlined />
              </IconButton>
            </Box>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default Developers;

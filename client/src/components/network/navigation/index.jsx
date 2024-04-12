import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Paper,
  Typography,
  Tabs,
  Tab,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CodeIcon from '@mui/icons-material/Code'; // Icon for developers
import AccountTreeIcon from '@mui/icons-material/AccountTree'; // Icon for architects
import GavelIcon from '@mui/icons-material/Gavel'; // Icon for attorneys
import LocationCityIcon from '@mui/icons-material/LocationCity'; // Icon for city planners
import ConstructionIcon from '@mui/icons-material/Construction'; // Icon for contractors
import GroupIcon from '@mui/icons-material/Group'; // Icon for groups
import EventIcon from '@mui/icons-material/Event'; // Icon for events

const networkOptions = [
  { icon: <CodeIcon />, text: 'Developers', count: 0, path: '/network/developers' },
  { icon: <AccountTreeIcon />, text: 'Architects', count: 0, path: '/network/architects' },
  { icon: <GavelIcon />, text: 'Attorneys', count: 0, path: '/network/attorneys' },
  { icon: <LocationCityIcon />, text: 'City Planners', count: 0, path: '/network/city-planners' },
  { icon: <ConstructionIcon />, text: 'Contractors', count: 0, path: '/network/contractors' },
  { icon: <GroupIcon />, text: 'Groups', count: 0, path: '/network/groups' },
  { icon: <EventIcon />, text: 'Events', count: 0, path: '/network/events' },
];

const Manage = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleListItemClick = (path) => {
    navigate(path);
  };

  return (
    <Paper
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gridColumn: 'span 6',
        transition: 'box-shadow 0.3s',
        boxShadow: 'none',
        borderColor: 'grey.300',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderRadius: '16px'
      }}
    >
      {/* Title */}
      <Typography variant='h5' sx={{ fontWeight: '500', p: '1rem 1rem 0 1rem' }}>
        Manage my network
      </Typography>

      {/* Menu Options List */}
      <List>
        {networkOptions.map((option, index) => (
          <ListItem button key={index} onClick={() => handleListItemClick(option.path)}>
            <ListItemIcon sx={{ minWidth: '35px' }}>
              {option.icon}
            </ListItemIcon>
            <ListItemText primary={option.text} />
            {option.count ? (
              <Typography variant="body2" color="text.secondary">
                {option.count}
              </Typography>
            ) : null}
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default Manage;

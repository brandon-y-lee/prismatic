import React from 'react';
import { Box, CircularProgress, Typography, useTheme } from '@mui/material';
import { useGetSupplierQuery } from 'state/api';
import { StoreOutlined } from '@mui/icons-material';


const ClientInfo = ({ title, value }) => {
  const theme = useTheme();

  return (
    <Box 
      gridColumn="span 1"
      gridRow="span 1"
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
      p="1rem 0.25rem 1.25rem 0.25rem"
      gap="0.5rem"
    >
      <Typography variant="h6" sx={{ color: theme.palette.grey[700] }}>
        {title}
      </Typography>
      <Typography variant="h6" fontWeight="600">
        {value}
      </Typography>
    </Box>
  );
};

const ViewClient = ({ userId }) => {
  const { data: user, isLoading, isError } = useGetSupplierQuery(userId);
  console.log('User: ', user);

  if (isLoading) return <CircularProgress />;
  if (isError || !user) return <Box>User not found.</Box>;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', m: '1rem 0rem 1.5rem' }}>
      <Box 
        gridColumn="span 1"
        gridRow="span 1"
        display="flex"
        flexDirection="row"
        p="1rem 0.25rem 1rem 0.25rem"
        gap="0.5rem"
      >
        <StoreOutlined sx={{ fontSize: '1.25rem', mr: 1 }} />
        <Typography variant="h5" fontWeight={550}>
          {user.name}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', p: '0rem 0.5rem', gap: '1rem' }}>
        <ClientInfo title='Email:' value={user.email} />
      { /*
        <ClientInfo title='Phone:' value={user.phone} />
        <ClientInfo title='Address:' value={user.address} /> */}
        <Box sx={{ flexGrow: 1 }} />
      </Box>
    </Box>
  );
};

export default ViewClient;
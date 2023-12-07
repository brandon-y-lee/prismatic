import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';

const OrderStat = ({ title, value }) => {
  const theme = useTheme();

  return (
    <Box 
      gridColumn="span 1"
      gridRow="span 1"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      p="1rem 0.25rem 1.25rem 0.25rem"
      gap="0.5rem"
    >
      <Typography variant="h6" sx={{ color: theme.palette.grey[700] }}>
        {title}
      </Typography>
      <Typography variant="h4" fontWeight="600">
        {value}
      </Typography>
    </Box>
  );
};

const ViewStats = ({ status, cost }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', mb: 2, gap: '1.5rem' }}>
      <OrderStat title='Status' value={status} />
      <OrderStat title='Cost' value={cost} />
      <Box sx={{ flexGrow: 1 }} />
    </Box>
  );
};

export default ViewStats;

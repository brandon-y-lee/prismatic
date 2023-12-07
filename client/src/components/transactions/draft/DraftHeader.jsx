import React from 'react';
import { Box, Typography, Button, Chip } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const DraftHeader = ({ isUpdate, transactionId, status }) => {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, gap: '1rem' }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ color: '#000' }} />
      {isUpdate 
        ? <Typography variant="h5" fontWeight={600}>Order #{transactionId}</Typography> 
        : <Typography variant="h5" fontWeight={600}>New</Typography>
      }
      <Chip label={status || 'Draft'} color="primary" />
      <Box sx={{ flexGrow: 1 }} />
    </Box>
  );
};

export default DraftHeader;
import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close'; // Import CloseIcon

const RepayEarlyHeader = ({ earlyRepaymentAmount, invoiceNumber, merchant, onClose }) => {
  return (
    <Box sx={{
      position: 'relative',
      background: 'linear-gradient(145deg, #E6F4FF, #D1E3F2)',
      display: 'flex',
      flexDirection: 'column',
      textAlign: 'center',
      gap: 1,
      px: 2,
      py: 4
    }}>
      <IconButton 
        onClick={onClose}
        sx={{
          position: 'absolute',
          top: 16,
          right: 16
        }}
      >
        <CloseIcon />
      </IconButton>

      <Typography variant="body1" fontWeight={500}>
        You Pay
      </Typography>
      <Typography variant="h1" fontWeight={500}>
        ${earlyRepaymentAmount}
      </Typography>
      <Typography variant="body1" fontWeight={500}>
        No. {invoiceNumber.substring(0, 4)} | {merchant}
      </Typography>
    </Box>
  );
};

export default RepayEarlyHeader;

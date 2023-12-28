import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close'; // Import CloseIcon

const RepayEarlyHeader = ({ earlyRepaymentAmount, invoiceNumber, merchant, onClose }) => {
  return (
    <Box sx={{
      position: 'relative',
      backgroundColor: '#1677FF',
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
          right: 16,
          color: 'white'
        }}
      >
        <CloseIcon />
      </IconButton>

      <Typography variant="body1" fontWeight={525} color={'white'}>
        You Pay
      </Typography>
      <Typography variant="h1" fontWeight={500} color={'white'}>
        ${earlyRepaymentAmount.toFixed(2)}
      </Typography>
      <Typography variant="body1" fontWeight={500} color={'white'}>
        No. {invoiceNumber.substring(0, 4)} | {merchant}
      </Typography>
    </Box>
  );
};

export default RepayEarlyHeader;

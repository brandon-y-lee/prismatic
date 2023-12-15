import React from 'react';
import { Box, Typography, IconButton, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FlexBetween from 'components/FlexBetween';


const RepaymentModalHeader = ({ invoiceNumber, merchant, onClose }) => {
  return (
    <Box>
      <FlexBetween sx={{ px: 2, py: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h5" fontWeight={500}>
            Repayment Options
          </Typography>
          <Typography variant="body2" fontWeight={500}>
            No. {invoiceNumber.substring(0, 4)} | {merchant}
          </Typography>
        </Box>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </FlexBetween>
      <Divider />
    </Box>
  );
};

export default RepaymentModalHeader;
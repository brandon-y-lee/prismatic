import React from 'react';
import { Drawer, Box } from '@mui/material';
import RepayEarlyHeader from './RepayEarlyHeader';
import RepayEarlyBody from './RepayEarlyBody';

const RepayEarlyModal = ({ isOpen, onClose, fundDetails, repaymentDetails }) => {
  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={onClose}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 2,
        '& .MuiDrawer-paper': {
          width: '100%',
          maxWidth: '500px',
          boxSizing: 'border-box',
        },
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: '500px',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <RepayEarlyHeader 
          invoiceNumber={fundDetails?.id}
          merchant={fundDetails?.merchant}
          earlyRepaymentAmount={fundDetails?.principalRemaining}
          onClose={onClose}
        />
        <RepayEarlyBody
          fundDetails={fundDetails}
          repaymentDetails={repaymentDetails}
          onClose={onClose}
          onRepayEarly={onClose}
        />
      </Box>
    </Drawer>
  );
};

export default RepayEarlyModal;
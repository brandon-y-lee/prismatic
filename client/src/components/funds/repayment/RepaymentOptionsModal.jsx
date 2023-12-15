import React, { useState, useEffect } from 'react';
import { Drawer, Box } from '@mui/material';
import RepaymentModalHeader from './RepaymentModalHeader';
import RepaymentModalBody from './RepaymentModalBody';
import RepayEarlyModal from './RepayEarlyModal';

const RepaymentOptionsModal = ({ isOpen, onClose, fundDetails, repaymentDetails }) => {
  const [isRepayEarlyModalOpen, setRepayEarlyModalOpen] = useState(false);

  const handleClose = () => {
    if (!isRepayEarlyModalOpen) {
      onClose();
    }
  };

  const onRepayEarly = () => {
    setRepayEarlyModalOpen(true);
  };

  const closeRepayEarly = () => {
    setRepayEarlyModalOpen(false);
  }

  useEffect(() => {
    if (isOpen) {
      console.log('Repayment modal opened.');
    }
  }, [isOpen]);

  return (
    <>
      <Drawer
        anchor="right"
        open={isOpen}
        onClose={handleClose}
        sx={{
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
          <RepaymentModalHeader 
            invoiceNumber={fundDetails?.id ?? 'No Fund ID'}
            merchant={fundDetails?.merchant ?? ''}
            onClose={onClose}
          />
          <RepaymentModalBody
            fundDetails={fundDetails}
            repaymentDetails={repaymentDetails}
            onClose={onClose}
            onRepayEarly={onRepayEarly}
          />
        </Box>
      </Drawer>
      {isRepayEarlyModalOpen && (
        <RepayEarlyModal
          isOpen={isRepayEarlyModalOpen}
          onClose={closeRepayEarly}
          fundDetails={fundDetails}
          repaymentDetails={repaymentDetails}
        />
      )}
    </>
  );
};

export default RepaymentOptionsModal;

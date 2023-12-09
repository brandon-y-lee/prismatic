import React, { useState } from 'react';
import { Drawer, Box } from '@mui/material';
import ModalHeader from './ModalHeader';
import ModalBody from './ModalBody';
import ModalSummary from './ModalSummary';

const FundingOptionsModal = ({ isOpen, onClose, fundingDetails }) => {
  const [agreementChecked, setAgreementChecked] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  const invoiceNumber = fundingDetails?.transactionId ?? 'No Invoice Selected';
  const amount = fundingDetails?.transactionAmount.amount ?? 'N/A';

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleAgreementChange = (event) => {
    setAgreementChecked(event.target.checked);
  };

  const handleConfirm = () => {
    // Implement confirmation logic here
    console.log('Confirmed funding details:', fundingDetails);
    onClose(); // Close the modal after confirmation
  };

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={onClose}
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
        <ModalHeader 
          invoiceNumber={invoiceNumber}
          onClose={onClose}
        />
        <ModalBody
          amount={amount}
        />
        <ModalSummary
          amount={amount}
          tabValue={tabValue}
          handleTabChange={handleTabChange}
          agreementChecked={agreementChecked}
          handleAgreementChange={handleAgreementChange}
          handleConfirm={handleConfirm}
        />
      </Box>
    </Drawer>
  );
};

export default FundingOptionsModal;

import React, { useState } from 'react';
import { Drawer, Box } from '@mui/material';
import FundingModalHeader from './FundingModalHeader';
import FundingModalBody from './FundingModalBody';
import FundingModalSummary from './FundingModalSummary';
import { getLoggedInUser } from 'utils/token';

const FundingOptionsModal = ({ isOpen, onClose, transactionDetails, onNewFund }) => {
  const user = getLoggedInUser();
  const [tabValue, setTabValue] = useState(0);
  const [agreementChecked, setAgreementChecked] = useState(false);
  const [repaymentPlanDetails, setRepaymentPlanDetails] = useState({});

  const accountNumber = transactionDetails?.account_id;
  const invoiceNumber = transactionDetails?.transaction_id;
  const merchant = transactionDetails?.merchant_name ?? transactionDetails?.name;
  const amount = transactionDetails?.amount;

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleAgreementChange = (event) => {
    setAgreementChecked(event.target.checked);
  };

  const handleConfirm = async (repaymentPlanDetails) => {
    if (agreementChecked && repaymentPlanDetails && repaymentPlanDetails.weeks) {
      try {
        const fundData = {
          userId: user.userId,
          accountId: accountNumber,
          invoiceId: invoiceNumber,
          invoiceAmount: amount,
          merchant: merchant,
          repaymentPlan: repaymentPlanDetails.weeks,
        };

        onNewFund(fundData);
        onClose();
      } catch (error) {
        console.error('Error creating fund:', error);
      }
    } else {
      console.log("Agreement not checked or repayment plan not set.");
    }
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
        <FundingModalHeader 
          invoiceNumber={invoiceNumber}
          merchant={merchant}
          onClose={onClose}
        />
        <FundingModalBody
          amount={amount}
        />
        <FundingModalSummary
          amount={amount}
          tabValue={tabValue}
          handleTabChange={handleTabChange}
          agreementChecked={agreementChecked}
          handleAgreementChange={handleAgreementChange}
          handleConfirm={handleConfirm}
          repaymentPlanDetails={repaymentPlanDetails}
          setRepaymentPlanDetails={setRepaymentPlanDetails}
        />
      </Box>
    </Drawer>
  );
};

export default FundingOptionsModal;

import { Box, Typography, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { format, parseISO } from 'date-fns';
import FlexBetween from "components/FlexBetween";
import { Divider } from "antd";

const RepayEarlyBody = ({ fundDetails, repaymentDetails, onClose, handleRepayEarly }) => {
  const [nextRepayment, setNextRepayment] = useState(0);

  const formatDate = (date) => {
    return format(parseISO(date), 'MMM-d-yyyy');
  };

  const handleConfirm = () => {
    try {
      const updateData = {
        userId: fundDetails.userId,
        selectedAccount: fundDetails?.accountId,
        fundId: fundDetails?.invoiceId,
        nextPaymentAmount: nextRepayment,
      };

      handleRepayEarly(updateData);
      onClose();
    } catch (error) {
      console.error('Error creating fund:', error);
    }
  };

  useEffect(() => {
    if (repaymentDetails?.nextRepaymentIds.includes(fundDetails?.invoiceId)) {
      setNextRepayment(repaymentDetails?.nextRepaymentAmount - fundDetails?.weeklyInstallment + fundDetails?.principalRemaining);
    } else {
      setNextRepayment(repaymentDetails?.nextRepaymentAmount + fundDetails?.principalRemaining);
    }
  }, [fundDetails, repaymentDetails]);

  return (
    <Box display='flex' flexDirection='column' sx={{ textAlign: 'center', m: 4 }}>
      <Box display='flex' flexDirection='column' gap={0.5} px={3} py={2}>
        <Typography variant="body1" gutterBottom fontWeight={525}>
          You Save
        </Typography>
        <Typography variant="h2" gutterBottom>
          ${fundDetails?.feeRemaining.toFixed(2)}
        </Typography>
        <Typography variant="body1" gutterBottom fontWeight={500}>
          in fees
        </Typography>
      </Box>

      <Box display='flex' flexDirection='column' gap={0.5} px={3} py={2}>
        <Divider />
        <FlexBetween>
          <Typography variant="body1" gutterBottom>
            Repay early on
          </Typography>
          <Typography variant="body1" gutterBottom sx={{ fontWeight: 525 }}>
            {formatDate(repaymentDetails?.nextRepaymentDate)}
          </Typography>
        </FlexBetween>
        <FlexBetween>
          <Typography variant="body1" gutterBottom>
            Cumulative next payment
          </Typography>
          <Typography variant="body1" gutterBottom sx={{ fontWeight: 525 }}>
            ${nextRepayment.toFixed(2)}
          </Typography>
        </FlexBetween>
      </Box>

      <Box py={4}>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color="primary"
          fullWidth
          sx={{
            backgroundColor: '#1677FF',
            color: 'white',
            textTransform: 'capitalize',
            fontWeight: '525',
            height: '50px',
            borderRadius: '0px',
            '&:hover': {
              backgroundColor: '#0044cc',
            },
          }}
        >
          Confirm
        </Button>
      </Box>
    </Box>
  );
};

export default RepayEarlyBody;
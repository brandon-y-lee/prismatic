import React, { useState, useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import { format, parseISO, isValid } from 'date-fns';

const RepaymentModalBody = ({ fundDetails, repaymentDetails, onClose, onRepayEarly }) => {
  const [nextRepayment, setNextRepayment] = useState(0);

  const formatDate = (date) => {
    const parsedDate = parseISO(date);
    return isValid(parsedDate) ? format(parsedDate, 'MMM-d-yyyy') : '';
  };

  useEffect(() => {
    if (repaymentDetails?.nextRepaymentIds.includes(fundDetails?.invoiceId)) {
      let nextRepayment = repaymentDetails?.nextRepaymentAmount - fundDetails?.nextPaymentAmount + fundDetails?.principalRemaining;
      setNextRepayment(nextRepayment);
    } else {
      setNextRepayment(repaymentDetails?.nextRepaymentAmount + fundDetails?.principalRemaining);
    }
  }, [fundDetails, repaymentDetails]);

  return (
    <Box display='flex' flexDirection='column' sx={{ textAlign: 'center', m: 4, gap: 2 }}>
      <Box sx={{ display:'flex', flexDirection: 'column', gap: 0.5, px: 2, py: 2 }}>
        <Typography variant="h4" gutterBottom fontWeight={525}>
          Repay Early
        </Typography>
        <Typography variant="body1" gutterBottom>
          Add the entire outstanding balance on this draw to your next debit on <strong>{formatDate(repaymentDetails?.nextRepaymentDate)}</strong>,
          bringing your total debit to <strong>${Math.abs(nextRepayment).toFixed(2)}</strong>.
        </Typography>
      </Box>

      <Typography variant="body1" gutterBottom fontWeight={525}>
        OR
      </Typography>

      <Box sx={{ display:'flex', flexDirection: 'column', gap: 0.5, px: 2, py: 2 }}>
        <Typography variant="h4" gutterBottom fontWeight={525}>
          Keep Your Original Plan
        </Typography>
        <Typography variant="body1" gutterBottom>
          Nothing will change. Your automatic weekly payments will continue to debit as scheduled.
        </Typography>
      </Box>

      <Box display='flex' flexDirection='column' gap={2}>
        <Button
          onClick={onClose}
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
          Keep Original Plan
        </Button>
        <Button
          onClick={onRepayEarly}
          variant="contained"
          color="primary"
          fullWidth
          sx={{
            backgroundColor: 'white',
            color: '#1677FF',
            textTransform: 'capitalize',
            fontWeight: '525',
            height: '50px',
            borderRadius: '0px',
            '&:hover': {
              backgroundColor: '#E6F4FF',
            },
          }}
        >
          Repay Early
        </Button>
      </Box>
    </Box>
  );
};

export default RepaymentModalBody;
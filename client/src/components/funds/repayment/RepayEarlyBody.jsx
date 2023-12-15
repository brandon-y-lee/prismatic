import { Box, Typography, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { format, parseISO } from 'date-fns';
import FlexBetween from "components/FlexBetween";
import { Divider } from "antd";

const RepayEarlyBody = ({ fundDetails, repaymentDetails, onClose, onRepayEarly }) => {
  const [nextRepayment, setNextRepayment] = useState(0);

  useEffect(() => {
    if (repaymentDetails?.nextRepaymentIds.includes(fundDetails?.id)) {
      setNextRepayment(repaymentDetails?.nextRepaymentAmount - fundDetails?.weeklyInstallment + fundDetails?.principalRemaining);
    } else {
      setNextRepayment(repaymentDetails?.nextRepaymentAmount + fundDetails?.principalRemaining);
    }
  }, [fundDetails, repaymentDetails]);

  const formatDate = (date) => {
    return format(parseISO(date), 'MMM-d-yyyy');
  }

  return (
    <Box display='flex' flexDirection='column' sx={{ textAlign: 'center', m: 4 }}>
      <Box display='flex' flexDirection='column' gap={0.5} px={3} py={2}>
        <Typography variant="body1" gutterBottom fontWeight={500}>
          You Save
        </Typography>
        <Typography variant="h2" gutterBottom>
          ${fundDetails?.feeRemaining}
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
            ${nextRepayment}
          </Typography>
        </FlexBetween>
      </Box>

      <Box py={4}>
        <Button
          onClick={onRepayEarly}
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
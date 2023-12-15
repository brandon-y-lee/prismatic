import { Box, Typography } from "@mui/material";
import React from "react";

const FundingModalBody = ({ amount }) => {
  const displayAmount = Math.abs(amount).toFixed(2);

  return (
    <Box display='flex' flexDirection='column' py={2} px={3} sx={{ textAlign: 'center', m: 4 }}>
      <Typography variant="h6" gutterBottom>
        You Get
      </Typography>
      <Typography variant="h2" gutterBottom fontWeight={500}>
        ${displayAmount}
      </Typography>
      <Typography variant="subtitle1">
        Funds will be sent tomorrow and are expected to arrive within 2 business days.
      </Typography>
    </Box>
  );
};

export default FundingModalBody;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Divider, Tab, Tabs, useMediaQuery } from '@mui/material';

import Header from 'components/Header';
import FlexBetween from 'components/FlexBetween';
import KpiCard from 'components/funds/KpiCard';
import { getLoggedInUser } from 'utils/token';
import FundsDataGrid from 'components/funds/FundsDataGrid';

const Funds = () => {
  const navigate = useNavigate();
  const user = getLoggedInUser();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
  const [tabValue, setTabValue] = useState(0);

  const handleCreateInvoice = () => {
    navigate('/invoice/create');
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const kpiData = [
    {
      title: "Available Credit",
      metric: "$12,699", // Replace with dynamic data
      progress: 50, // Replace with dynamic calculation
      target: "$25,000", // Replace with dynamic data
      delta: "5%", // Sample value, replace as needed
      deltaType: "increase" // 'increase', 'decrease', or 'moderate'
    },
    {
      title: "Upcoming Payment",
      metric: "$1,200", // Replace with dynamic data
      progress: 30, // Replace with dynamic calculation
      target: "$4,000", // Replace with dynamic data
      paymentDate: "Dec 25, 2023",
      delta: "2%", // Sample value, replace as needed
      deltaType: "decrease" // 'increase', 'decrease', or 'moderate'
    }
    // ... additional KPIs as needed
  ];
  
  return (
    <Box>
      <Box m="1.5rem 2.5rem">
        <FlexBetween>
          <Header title="FUNDS" />
          <Button
            variant="primary"
            size="small"
            onClick={handleCreateInvoice}
          >
            Upload New Invoice
          </Button>
        </FlexBetween>

        <Box
          display="grid"
          gridTemplateColumns="repeat(12, 1fr)"
          gridAutoRows="160px"
          gap="20px"
          sx={{
            "& > div": { gridColumn: isNonMediumScreens ? undefined : "span 12" },
            mt: '20px',
            mb: '20px',
          }}
        >
          <Box gridColumn={isNonMediumScreens ? 'span 8' : 'span 12'}>
            <KpiCard {...kpiData[0]} showTarget={true} showProgressBar={true} />
          </Box>
          <Box gridColumn={isNonMediumScreens ? 'span 4' : 'span 12'}>
            <KpiCard {...kpiData[1]} showPaymentDate={true}/>
          </Box>
        </Box>

        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="funds tabs"
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: '500',
              fontSize: '14px',
              color: 'black',
              borderColor: 'grey.300',
              borderWidth: '1px',
              borderStyle: 'solid',
              '&.Mui-selected': {
                backgroundColor: 'white',
                color: 'black',
              },
              '&:not(.Mui-selected)': {
                backgroundColor: '#f5f5f5',
              },
            }
          }}
        >
          <Tab label="Invoices" />
          <Tab label="In Repayment" />
        </Tabs>
      </Box>

      <Box>
        <Divider />
      </Box>

      <Box m="0rem 3rem 1.5rem">
        <FundsDataGrid
          user={user}
          tabValue={tabValue}
        />
      </Box>
    </Box>
  );
};

export default Funds;
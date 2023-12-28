import React, { useState } from 'react';
import { Box, Divider, Tab, Tabs, useMediaQuery } from '@mui/material';
import Header from 'components/Header';
import FlexBetween from 'components/FlexBetween';
import Link from 'components/funds/Link';
import AccountSwitcher from 'components/funds/AccountSwitcher';
import FundKpi from 'components/funds/analysis/FundKpi';
import RepaymentKpi from 'components/funds/analysis/RepaymentKpi';
import FundKpiExpanded from 'components/funds/analysis/FundKpiExpanded';
import RepaymentKpiExpanded from 'components/funds/analysis/RepaymentKpiExpanded';
import FundsDataGrid from 'components/funds/FundsDataGrid';
import { FundsProvider } from 'context/FundsContext';

const Funds = () => {
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
  const [tabValue, setTabValue] = useState(0);
  const [isLinkDialogOpen, setLinkDialogOpen] = useState(false);
  const [expandedCard, setExpandedCard] = useState(null);

  const handleOpenLinkDialog = () => setLinkDialogOpen(true);
  const handleCloseLinkDialog = () => setLinkDialogOpen(false);
  const handleCardClick = (card) => setExpandedCard(expandedCard === card ? null : card);
  const handleTabChange = (event, newValue) => setTabValue(newValue);

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
  ];

  return (
    <FundsProvider>
      <Box m="1.5rem 2.5rem">
        <FlexBetween>
          <Header title="Accounts Payable" />
          <AccountSwitcher
            openDialog={handleOpenLinkDialog}
          />
          <Link
            isOpen={isLinkDialogOpen}
            onClose={handleCloseLinkDialog}
          />
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
            <FundKpi
              {...kpiData[0]}
              onCardClick={() => handleCardClick('fund')}
              isExpanded={expandedCard === 'fund'} 
            />
          </Box>
          <Box gridColumn={isNonMediumScreens ? 'span 4' : 'span 12'}>
            <RepaymentKpi 
              onCardClick={() => handleCardClick('repayment')}
              isExpanded={expandedCard === 'repayment'} 
            />
          </Box>
        </Box>

        {expandedCard === 'fund' && (
          <FundKpiExpanded
            expandedCard={expandedCard}
            onClose={() => setExpandedCard(null)}
          />
        )}
        {expandedCard === 'repayment' && (
          <RepaymentKpiExpanded
            expandedCard={expandedCard}
            onClose={() => setExpandedCard(null)}
          />
        )}

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

      <Box m="1rem 1.25rem 1.5rem">
        <FundsDataGrid tabValue={tabValue} />
      </Box>
    </FundsProvider>
  );
};

export default Funds;
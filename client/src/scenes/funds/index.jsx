import React, { useEffect, useState } from 'react';
import { Box, Dialog, Divider, Tab, Tabs, useMediaQuery } from '@mui/material';

import Header from 'components/Header';
import FlexBetween from 'components/FlexBetween';
import Link from 'components/funds/Link';
import AccountSwitcher from 'components/funds/AccountSwitcher';
import FundKpi from 'components/funds/analysis/FundKpi';
import RepaymentKpi from 'components/funds/analysis/RepaymentKpi';
import FundKpiExpanded from 'components/funds/analysis/FundKpiExpanded';
import RepaymentKpiExpanded from 'components/funds/analysis/RepaymentKpiExpanded';
import FundsDataGrid from 'components/funds/FundsDataGrid';

import { useGetFundsMutation, useGetPlaidTransactionsMutation } from 'state/api';
import { getLoggedInUser } from 'utils/token';


const Funds = () => {
  const user = getLoggedInUser();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
  const [tabValue, setTabValue] = useState(0);

  const [accountIds, setAccountIds] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [transactionsData, setTransactionsData] = useState({});
  const [fundsData, setFundsData] = useState({});

  const [isLinkDialogOpen, setLinkDialogOpen] = useState(false);
  const [getTransactions] = useGetPlaidTransactionsMutation();
  const [getFunds] = useGetFundsMutation();

  const [expandedCard, setExpandedCard] = useState(null);

  const handleCardClick = (card) => {
    setExpandedCard(expandedCard === card ? null : card);
  };

  const handleOpenLinkDialog = () => {
    setLinkDialogOpen(true);
  };
  
  const handleCloseLinkDialog = () => {
    setLinkDialogOpen(false);
  };

  const handleAccountUpdate = (updatedAccountIds) => {
    setAccountIds(updatedAccountIds);
    if (updatedAccountIds.length > 0) {
      setSelectedAccount(updatedAccountIds[0]);
      fetchTransactionsAndFunds();
    }
  };

  const handleAccountChange = (accountId) => {
    setSelectedAccount(accountId);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleNewFund = (newFund) => {
    // Assumes fundsData is structured as { accountId: [funds] }
    if (fundsData[newFund.accountId]) {
      setFundsData(prev => ({
        ...prev,
        [newFund.accountId]: [...prev[newFund.accountId], newFund]
      }));

      setTransactionsData(prev => {
        const accountId = newFund.accountId;
        if (!prev[accountId]) {
          return prev; // No transactions for this account
        }
    
        // Filter out the transaction that matches the new fund's invoiceId
        const updatedTransactions = prev[accountId].filter(txn => txn.transaction_id !== newFund.id);
        return {
          ...prev,
          [accountId]: updatedTransactions
        };
      });
    }
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
  ];

  const fetchTransactionsAndFunds = async () => {
    try {
      const transactionsResponse = await getTransactions({ userId: user.id }).unwrap();
      console.log('getTransactions Response: ', transactionsResponse);

      let organizedTransactions = {};
      transactionsResponse.transactions.forEach(txn => {
        if (!organizedTransactions[txn.account_id]) {
          organizedTransactions[txn.account_id] = [];
        }
        organizedTransactions[txn.account_id].push(txn);
      });

      setTransactionsData(organizedTransactions);

      const accountIdsArray = Object.keys(organizedTransactions);
      const fundsResponse = await getFunds({ accountIds: accountIdsArray }).unwrap();
      console.log('getFunds Response: ', fundsResponse);

      setFundsData(fundsResponse);

    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  useEffect(() => {
    if (transactionsData) {
      console.log("Transactions Data: ", transactionsData);
    }
  }, [transactionsData]);

  useEffect(() => {
    if (fundsData) {
      console.log("Funds Data: ", fundsData);
    }
  }, [fundsData]);

  return (
    <Box>
      <Box m="1.5rem 2.5rem">
        <FlexBetween>
          <Header title="Accounts Payable" />
          <AccountSwitcher
            accountIds={accountIds}
            selectedAccount={selectedAccount}
            onAccountChange={handleAccountChange}
            openDialog={handleOpenLinkDialog}
          />
          <Link
            isOpen={isLinkDialogOpen}
            onClose={handleCloseLinkDialog}
            onAccountSet={handleAccountUpdate}
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
              {...kpiData[1]}
              onCardClick={() => handleCardClick('repayment')}
              isExpanded={expandedCard === 'repayment'} 
            />
          </Box>
        </Box>

        <Dialog
          open={expandedCard !== null}
          onClose={() => setExpandedCard(null)}
          fullWidth
          maxWidth="md"
        >
          {expandedCard === 'fund' && (
            <FundKpiExpanded expandedCard={expandedCard} onClose={() => setExpandedCard(null)} />
          )}
          {expandedCard === 'repayment' && (
            <RepaymentKpiExpanded expandedCard={expandedCard} onClose={() => setExpandedCard(null)} />
          )}
        </Dialog>

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
        {Object.keys(transactionsData).length > 0 && (
          <FundsDataGrid
            user={user}
            tabValue={tabValue}
            transactionsData={tabValue === 0 ? transactionsData[selectedAccount] || [] : []}
            fundsData={tabValue === 1 ? fundsData[selectedAccount] || [] : []}
            handleNewFund={handleNewFund}
          />
        )}
      </Box>
    </Box>
  );
};

export default Funds;
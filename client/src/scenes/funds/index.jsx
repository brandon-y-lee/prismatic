import React, { useEffect, useState } from 'react';
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

import { useGetFundsMutation, useGetPlaidTransactionsMutation, useCreateFundMutation, useGetUserRepaymentDetailsQuery } from 'state/api';
import { getLoggedInUser } from 'utils/token';

const Funds = () => {
  const user = getLoggedInUser();
  const userId = user.id;
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
  const [tabValue, setTabValue] = useState(0);

  const [accountIds, setAccountIds] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [transactionsData, setTransactionsData] = useState({});
  const [fundsData, setFundsData] = useState({});

  const [isLinkDialogOpen, setLinkDialogOpen] = useState(false);
  const [expandedCard, setExpandedCard] = useState(null);

  const [getTransactions] = useGetPlaidTransactionsMutation();
  const [getFunds] = useGetFundsMutation();
  const [createFund] = useCreateFundMutation();

  const [hasFundsForSelectedAccount, setHasFundsForSelectedAccount] = useState(false);

  const { data: userDetails } = useGetUserRepaymentDetailsQuery({
    userId,
    selectedAccount
  }, { skip: !hasFundsForSelectedAccount });

  const [repaymentDetails, setRepaymentDetails] = useState({
    nextRepaymentIds: [''],
    nextRepaymentAmount: 0,
    nextRepaymentDate: '',
  });

  const handleCardClick = (card) => {
    setExpandedCard(expandedCard === card ? null : card);
  };

  const handleOpenLinkDialog = () => {
    setLinkDialogOpen(true);
  };
  
  const handleCloseLinkDialog = () => {
    setLinkDialogOpen(false);
  };

  const handleAccountSet = (connectedAccountIds) => {
    setAccountIds(connectedAccountIds);
    if (connectedAccountIds.length > 0) {
      setSelectedAccount(connectedAccountIds[0]);
    }
    fetchTransactionsAndFunds();
  };

  const handleAccountChange = (accountId) => {
    setSelectedAccount(accountId);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleNewFund = async (newFundData) => {
    try {
      const response = await createFund(newFundData).unwrap();
      console.log("createFund response: ", response);

      fetchTransactionsAndFunds();
    } catch (error) {
      console.error('Error creating new Fund: ', error);
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
      const fundsResponse = await getFunds({ accountIds: accountIds }).unwrap();
      console.log('Initial getFunds response: ', fundsResponse);
  
      const transactionsResponse = await getTransactions({ userId: user.id }).unwrap();
      let organizedTransactions = {};
  
      transactionsResponse.transactions.forEach(txn => {
        if (!organizedTransactions[txn.account_id]) {
          organizedTransactions[txn.account_id] = [];
        }
  
        const isFund = (fundsResponse[txn.account_id] && fundsResponse[txn.account_id].some(fund => fund.id === txn.transaction_id));
  
        if (!isFund) {
          organizedTransactions[txn.account_id].push(txn);
        }
      });
  
      setTransactionsData(organizedTransactions);
      setFundsData(fundsResponse);
  
    } catch (error) {
      console.error('Error fetching transactions and funds: ', error);
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

  useEffect(() => {
    if (fundsData[selectedAccount] && fundsData[selectedAccount].length > 0) {
      setHasFundsForSelectedAccount(true);
    }
  }, [fundsData, selectedAccount]);

  useEffect(() => {
    if (userDetails) {
      setRepaymentDetails({
        nextRepaymentIds: userDetails.nextRepaymentIds,
        nextRepaymentAmount: userDetails.nextRepaymentAmount,
        nextRepaymentDate: userDetails.nextRepaymentDate,
      });
    }
    setHasFundsForSelectedAccount(false);
  }, [userDetails]);

  useEffect(() => {
    if (repaymentDetails) {
      console.log("Repayment Details: ", repaymentDetails);
    }
  }, [repaymentDetails]);

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
            onAccountSet={handleAccountSet}
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
              repaymentDetails={repaymentDetails}
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
            fundsData={fundsData[selectedAccount] || []}
            repaymentDetails={repaymentDetails}
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
        {Object.keys(transactionsData).length > 0 && (
          <FundsDataGrid
            user={user}
            tabValue={tabValue}
            transactionsData={tabValue === 0 ? transactionsData[selectedAccount] || [] : []}
            fundsData={tabValue === 1 ? fundsData[selectedAccount] || [] : []}
            handleNewFund={handleNewFund}
            repaymentDetails={repaymentDetails}
          />
        )}
      </Box>
    </Box>
  );
};

export default Funds;
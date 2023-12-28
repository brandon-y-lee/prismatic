import React, { createContext, useState, useEffect } from 'react';
import { getLoggedInUser } from 'utils/token';
import { 
  useGetPlaidTransactionsMutation, 
  useGetFundsMutation, 
  useCreateFundMutation, 
  useGetAccountRepaymentDetailsQuery,
  useUpdateAccountRepaymentDetailsMutation
} from 'state/api';

export const FundsContext = createContext();

export const FundsProvider = ({ children }) => {
  const user = getLoggedInUser();
  const authId = user.authId;

  const [accountIds, setAccountIds] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [transactionsData, setTransactionsData] = useState({});
  const [fundsData, setFundsData] = useState({});
  const [hasFundsForSelectedAccount, setHasFundsForSelectedAccount] = useState(false);

  const [repaymentDetails, setRepaymentDetails] = useState({
    nextRepaymentIds: [],
    nextRepaymentAmount: 0,
    nextRepaymentDate: '',
  });

  const [getTransactions] = useGetPlaidTransactionsMutation();
  const [getFunds] = useGetFundsMutation();
  const [createFund] = useCreateFundMutation();
  const { data: accountDetails } = useGetAccountRepaymentDetailsQuery({ selectedAccount }, { skip: !hasFundsForSelectedAccount });
  const [updateAccountRepaymentDetails] = useUpdateAccountRepaymentDetailsMutation();

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

  const handleNewFund = async (newFundData) => {
    try {
      const response = await createFund(newFundData).unwrap();
      console.log("createFund response: ", response);

      fetchTransactionsAndFunds();
    } catch (error) {
      console.error('Error creating new Fund: ', error);
    }
  };

  const handleRepayEarly = async (updateData) => {
    try {
      const response = await updateAccountRepaymentDetails(updateData).unwrap();
      console.log('repayEarly response: ', response);

      fetchTransactionsAndFunds();
    } catch (error) {
      console.error('Error updating account repayment details:', error);
    }
  };

  const fetchTransactionsAndFunds = async () => {
    try {
      const fundsResponse = await getFunds({ accountIds: accountIds }).unwrap();
      console.log('Initial getFunds response: ', fundsResponse);
  
      const transactionsResponse = await getTransactions({ authId: authId }).unwrap();
      let organizedTransactions = {};
  
      transactionsResponse.transactions.forEach(txn => {
        if (!organizedTransactions[txn.account_id]) {
          organizedTransactions[txn.account_id] = [];
        }
  
        const isFund = (fundsResponse[txn.account_id] && fundsResponse[txn.account_id].some(fund => fund.invoiceId === txn.transaction_id));
  
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
    if (accountDetails) {
      console.log("Account Details: ", accountDetails);
      setRepaymentDetails({
        nextRepaymentIds: accountDetails.nextRepaymentIds,
        nextRepaymentAmount: accountDetails.nextRepaymentAmount,
        nextRepaymentDate: accountDetails.nextRepaymentDate,
      });
    }
    setHasFundsForSelectedAccount(false);
  }, [accountDetails]);

  return (
    <FundsContext.Provider value={{ accountIds, selectedAccount, transactionsData, fundsData, repaymentDetails, handleAccountSet, handleAccountChange, handleNewFund, handleRepayEarly }}>
      {children}
    </FundsContext.Provider>
  );
};
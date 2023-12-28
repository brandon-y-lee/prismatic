import React, { useContext, useState, useEffect } from 'react';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { CircularProgress, Box, Button, LinearProgress } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // Import CheckCircleIcon
import { formatDistanceToNow, format, parseISO } from 'date-fns';
import FundingOptionsModal from './modal/FundingOptionsModal';
import RepaymentOptionsModal from './repayment/RepaymentOptionsModal';
import FlexBetween from 'components/FlexBetween';
import { FundsContext } from 'context/FundsContext';

const FundsDataGrid = ({ tabValue }) => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [setSort] = useState({});

  const { selectedAccount, transactionsData, fundsData, repaymentDetails, handleNewFund, handleRepayEarly } = useContext(FundsContext);

  const [selectedTransactionDetails, setSelectedTransactionDetails] = useState(null);
  const [selectedFundDetails, setSelectedFundDetails] = useState(null);
  const [fundingOptionsModalOpen, setFundingOptionsModalOpen] = useState(false);
  const [repaymentOptionsModalOpen, setRepaymentOptionsModalOpen] = useState(false);

  const handleFundingOptionsClick = (transaction) => {
    if (transaction) {
      setSelectedTransactionDetails(transaction);
      setFundingOptionsModalOpen(true);
    } else {
      console.error('Transaction details are missing');
    }
  };

  const handleRepaymentOptionsClick = (fund) => {
    if (fund) {
      setSelectedFundDetails(fund);
      setRepaymentOptionsModalOpen(true);
    } else {
      console.error('Transaction details are missing');
    }
  };

  const isTransactionsDataEmpty = () => {
    return tabValue === 0 && (!transactionsData[selectedAccount] || transactionsData[selectedAccount].length === 0);
  };

  const isFundsDataEmpty = () => {
    return tabValue === 1 && (!fundsData[selectedAccount] || fundsData[selectedAccount].length === 0);
  };

  const renderProgressBar = (paymentsMade, totalPayments) => {
    const progress = (paymentsMade / totalPayments) * 100;
    return <LinearProgress variant="determinate" value={progress} />;
  };
  
  const transactionColumns = [
    { 
      field: 'transactionDetails',
      headerName: 'Transaction',
      flex: 0.55,
      renderCell: (params) => {
        const merchant = (params.row.name);
        const transactionDate = (params.row.date);
        return (
          <Box>
            <div>{merchant}</div>
            <div>{transactionDate}</div>
          </Box>
        );
      }
    },
    { 
      field: 'issuedDue', 
      headerName: 'Issued / Due', 
      flex: 0.55,
      renderCell: (params) => {
        const due = formatDistanceToNow(new Date(params.row.date), { addSuffix: true });
        return (
          <Box>
            <div>Issued: {due}</div>
            <div>Due: {due}</div>
          </Box>
        );
      }
    },
    { 
      field: 'amount', 
      headerName: 'Available Funds', 
      headerAlign: 'right',
      align: 'right',
      flex: 0.5, 
      renderCell: (params) => (
        <div style={{ fontSize: '1rem' }}>${Math.abs(params.row.amount).toFixed(2)}</div>
      ),
      cellClassName: 'amount-cell'
    },
    { 
      field: 'fundingOptions',
      headerName: '',
      align: 'right',
      flex: 0.5,
      renderCell: (params) => (
        <Button 
          variant="contained"
          sx={{
            width: '75%',
            backgroundColor: 'white',
            color: '#1677FF',
            textTransform: 'capitalize',
            fontSize: '14px',
            fontWeight: '550',
            border: 'none',
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: '#1677FF',
              color: 'white',
            },
          }}
          onClick={() => handleFundingOptionsClick(params.row)}
        >
          Funding Options
        </Button>
      )
    },
  ];

  const repaymentColumns = [
    {
      field: "id",
      flex: 1,
      headerName: "Funding Details",
      renderCell: (params) => (
        <Box>
          <div>#{params.row.invoiceId.substring(0, 4)}</div>
          <div style={{ fontSize: 'larger' }}>{params.row.merchant}</div>
          <div>${params.row.invoiceAmount.toFixed(2)}</div>
        </Box>
      )
    },
    {
      field: "activity",
      flex: 1,
      headerName: "Activity",
      renderCell: (params) => {
        const formattedDate = format(parseISO(params.row.expiryDate), "MMM. dd, yyyy");
        return (
          <FlexBetween sx={{ width: '100%' }}>
            <Box>
              <div>Next Payment:</div>
              <div style={{ fontSize: '1.15rem' }}>${params.row.nextPaymentAmount.toFixed(2)}</div>
            </Box>
            <Box display='flex' flexDirection='column' gap='5px'>
              <div>{params.row.paymentsRemaining} payments left</div>
              {renderProgressBar(params.row.paymentsMade, params.row.repaymentPlan)}
              <div>Ends on: {formattedDate}</div>
            </Box>
          </FlexBetween>
        )
      }
    },
    {
      field: "amountLeft",
      flex: 1,
      headerName: "Left to Pay",
      headerAlign: 'right',
      renderCell: (params) => (
        <Box sx={{ width: '100%', textAlign: 'end' }}>
          <div style={{ fontSize: '1.15rem' }}>${params.row.debitRemaining.toFixed(2)}</div>
          <div>Incl. ${params.row.feeRemaining.toFixed(2)} in fees</div>
        </Box>
      )
    },
    { 
      field: 'repayEarly',
      headerName: '',
      align: 'right',
      flex: 1,
      renderCell: (params) => {
        return params.row.repayEarly ? (
          <Button
            variant="contained"
            startIcon={<CheckCircleIcon />}
            disabled
            sx={{
              width: '75%',
              backgroundColor: '#e0e0e0',
              color: 'green',
              textTransform: 'capitalize',
              fontSize: '14px',
              fontWeight: '550',
              border: 'none',
              boxShadow: 'none',
            }}
          >
            Set To Pay Early
          </Button>
        ) : (
          <Button 
            variant="contained"
            sx={{
              width: '75%',
              backgroundColor: 'white',
              color: '#1677FF',
              textTransform: 'capitalize',
              fontSize: '14px',
              fontWeight: '550',
              border: 'none',
              boxShadow: 'none',
              '&:hover': {
                backgroundColor: '#1677FF',
                color: 'white',
              },
            }}
            onClick={() => handleRepaymentOptionsClick(params.row)}
          >
            Repay Early
          </Button>
        );
      }
    },
  ];

  useEffect(() => {
    console.log("Tab value changed to:", tabValue);

  }, [tabValue]);

  if (!transactionsData && !fundsData) return <CircularProgress />;

  if (isTransactionsDataEmpty()) {
    return (
      <Box sx={{ textAlign: 'center', marginTop: '20px' }}>
        Connect Your Bank Account
      </Box>
    );
  }

  if (isFundsDataEmpty()) {
    return (
      <Box sx={{ textAlign: 'center', marginTop: '20px' }}>
        No Active Funds
      </Box>
    );
  }

  const columns = tabValue === 0 ? transactionColumns : repaymentColumns;
  const rows = tabValue === 0
    ? (transactionsData[selectedAccount]).map(txn => ({ ...txn, _id: txn.transaction_id }))
    : (fundsData[selectedAccount]).map(fund => ({ ...fund, _id: fund.invoiceId }))

  return (
    <Box width="100%">
      <DataGridPro
        loading={!rows.length}
        getRowId={(row) => row._id}
        rows={rows}
        columns={columns}
        rowHeight={90}
        disableColumnResize
        hideFooter={true}
        pagination
        page={page}
        pageSize={pageSize}
        paginationMode="server"
        sortingMode="server"
        onPageChange={(newPage) => setPage(newPage)}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        onSortModelChange={(newSortModel) => setSort(...newSortModel)}
        sx={{
          border: 'none',
          '& .MuiDataGrid-columnHeaders': {
            borderBottom: '1px solid rgba(224, 224, 224, 1)',
            fontWeight: 'bold',
          },
          '& .MuiDataGrid-row': {
            borderBottom: '1px solid rgba(224, 224, 224, 0.1)',
            fontWeight: '550',
          },
          '& .amount-cell': {
            fontSize: '14px',
          },
        }}
      />
      <FundingOptionsModal
        isOpen={fundingOptionsModalOpen}
        onClose={() => setFundingOptionsModalOpen(false)}
        transactionDetails={selectedTransactionDetails}
        onNewFund={handleNewFund}
      />
      <RepaymentOptionsModal
        isOpen={repaymentOptionsModalOpen}
        onClose={() => setRepaymentOptionsModalOpen(false)}
        fundDetails={selectedFundDetails}
        repaymentDetails={repaymentDetails}
        handleRepayEarly={handleRepayEarly}
      />
    </Box>
  );
};

export default FundsDataGrid;

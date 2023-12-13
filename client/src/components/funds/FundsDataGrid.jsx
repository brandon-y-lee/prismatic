import React, { useEffect, useState } from 'react';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { CircularProgress, Box, Button, LinearProgress } from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import FundingOptionsModal from './modal/FundingOptionsModal';
import FlexBetween from 'components/FlexBetween';
import { format, parseISO } from 'date-fns';


const FundsDataGrid = ({ tabValue, transactionsData, fundsData, handleNewFund }) => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [setSort] = useState({});

  const [fundingOptionsModalOpen, setFundingOptionsModalOpen] = useState(false);
  const [selectedTransactionDetails, setSelectedTransactionDetails] = useState(null);

  const handleFundingOptionsClick = (transaction) => {
    if (transaction) {
      setSelectedTransactionDetails(transaction);
      setFundingOptionsModalOpen(true);
    } else {
      console.error('Transaction details are missing');
    }
  };

  const isFundsDataEmpty = () => {
    return tabValue === 1 && (!fundsData || fundsData.length === 0);
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
        <div style={{ fontSize: '1rem' }}>${(params.row.amount).toFixed(2)}</div>
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

  const renderProgressBar = (paymentsMade, totalPayments) => {
    const progress = (paymentsMade / totalPayments) * 100;
    return <LinearProgress variant="determinate" value={progress} />;
  };

  const repaymentColumns = [
    {
      field: "id",
      flex: 0.5,
      headerName: "Funding Details",
      renderCell: (params) => (
        <Box>
          <div>#{params.row.id.substring(0, 4)}</div>
          <div style={{ fontSize: 'larger' }}>{params.row.merchant}</div>
          <div>${(params.row.invoiceAmount).toFixed(2)}</div>
        </Box>
      )
    },
    {
      field: "activity",
      flex: 0.65,
      headerName: "Activity",
      renderCell: (params) => {
        const formattedDate = format(parseISO(params.row.expiryDate), "MMM. dd, yyyy");
        return (
          <FlexBetween sx={{ width: '100%' }}>
            <Box>
              <div>Next Payment:</div>
              <div style={{ fontSize: '1.25rem' }}>${params.row.weeklyInstallment}</div>
            </Box>
            <Box display='flex' flexDirection='column' gap='5px'>
              <div>{params.row.paymentsLeft} payments left</div>
              {renderProgressBar(params.row.paymentsMade, params.row.repaymentPlan)}
              <div>Ends on: {formattedDate}</div>
            </Box>
          </FlexBetween>
        )
      }
    },
    {
      field: "amountLeft",
      flex: 0.5,
      headerName: "Left to Pay",
      headerAlign: 'right',
      renderCell: (params) => (
        <Box sx={{ width: '100%', textAlign: 'end' }}>
          <div style={{ fontSize: '1.25rem' }}>${params.row.amountLeft}</div>
          <div>Incl. ${params.row.totalFees} in fees</div>
        </Box>
      )
    },
    { 
      field: 'repayEarly',
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
        >
          Repay Early
        </Button>
      )
    },
  ];

  useEffect(() => {
    console.log("Tab value changed to:", tabValue);

  }, [tabValue]);

  if (!transactionsData && !fundsData) return <CircularProgress />;

  if (isFundsDataEmpty()) {
    return (
      <Box sx={{ textAlign: 'center', marginTop: '20px' }}>
        No active Funds
      </Box>
    );
  }

  const columns = tabValue === 0 ? transactionColumns : repaymentColumns;
  const rows = tabValue === 0
    ? transactionsData.map(txn => ({ ...txn, _id: txn.transaction_id }))
    : fundsData.map(fund => ({ ...fund, _id: fund.id }))


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
    </Box>
  );
};

export default FundsDataGrid;

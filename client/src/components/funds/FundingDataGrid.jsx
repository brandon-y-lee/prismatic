import React, { useState, useEffect } from 'react';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { CircularProgress, Box, Button } from '@mui/material';
import { renderPaymentChip } from 'utils/transaction';
import { formatDistanceToNow } from 'date-fns';
import FundingOptionsModal from './modal/FundingOptionsModal';

const FundingDataGrid = ({ user, tabValue, transactionsData }) => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [sort, setSort] = useState({});
  const [search] = useState("");

  const [fundingOptionsModalOpen, setFundingOptionsModalOpen] = useState(false);
  const [selectedFundingDetails, setSelectedFundingDetails] = useState(null);

  const handleFundingOptionsClick = (transaction) => {
    if (transaction) {
      setSelectedFundingDetails(transaction);
      setFundingOptionsModalOpen(true);
    } else {
      console.error('Transaction details are missing');
    }
  };

  const transactionColumns = [
    { field: 'transactionId', headerName: 'Transaction ID', flex: 1 },
    { 
      field: 'issuedDue', 
      headerName: 'Issued / Due', 
      flex: 1,
      renderCell: (params) => {
        const issued = formatDistanceToNow(new Date(params.row.bookingDate), { addSuffix: true });
        const due = formatDistanceToNow(new Date(params.row.valueDate), { addSuffix: true });
        return (
          <Box>
            <div>Issued: {issued}</div>
            <div>Due: {due}</div>
          </Box>
        );
      }
    },
    { 
      field: 'amount', 
      headerName: 'Total', 
      flex: 0.5, 
      valueGetter: (params) => `${params.row.transactionAmount.amount} ${params.row.transactionAmount.currency}`,
      cellClassName: 'amount-cell'
    },
    { 
      field: 'fundingOptions',
      headerName: '',
      flex: 0.50,
      renderCell: (params) => (
        <Button 
          variant="contained"
          sx={{
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
      field: "fundingDetails",
      flex: 1,
      headerName: "Funding Details",
    },
    {
      field: "activity",
      flex: 1,
      headerName: "Activity",
      renderCell: (params) => (
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%', gap: '2rem' }}>
          {/* Left side content */}
          <Box sx={{ fontWeight: '550' }}>
            {params.value}
          </Box>
          {/* Right side content, such as buttons or icons */}
          <Button variant="contained" size="small" onClick={() => {/* handle action */}}>
            Repay Early
          </Button>
        </Box>
      ),
    },
    {
      field: "leftToPay",
      flex: 0.75,
      headerName: "Left to Pay",
      renderCell: (params) => {
        return (
          renderPaymentChip(params.row.payment)
        )
      },
    },
  ];

  const columns = tabValue === 0 ? transactionColumns : repaymentColumns;

  if (!transactionsData || transactionsData.length === 0) return <CircularProgress />;

  const bookedTransactions = transactionsData?.booked || [];
  const flattenedTransactions = bookedTransactions.map(transaction => ({
    ...transaction,
    _id: transaction.transactionId,
    amount: transaction.transactionAmount.amount,
    currency: transaction.transactionAmount.currency
  }));


  return (
    <>
      <DataGridPro
        loading={!flattenedTransactions.length}
        getRowId={(row) => row._id}
        rows={flattenedTransactions}
        columns={transactionColumns}
        rowHeight={80}
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
        fundingDetails={selectedFundingDetails}
      />
    </>
  );
};

export default FundingDataGrid;

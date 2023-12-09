import React, { useState, useEffect } from 'react';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { CircularProgress, Box, Button } from '@mui/material';
import { useGetTransactionsQuery } from 'state/api';
import { renderStatusChip, renderPaymentChip } from 'utils/transaction';

const FundsDataGrid = ({ user, tabValue, transactionsData }) => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [sort, setSort] = useState({});
  const [search] = useState("");

  const { data, isLoading, isError } = useGetTransactionsQuery({
    userId: user.id,
    page,
    pageSize,
    sort: JSON.stringify(sort),
    search,
  });

  useEffect(() => {

  }, [tabValue, page, pageSize, sort, search]);

  if (!transactionsData || transactionsData.length === 0) return <CircularProgress />;
  if (isError || !data) return <Box>Error loading data.</Box>;

  // Flatten the transaction data for DataGridPro
  const bookedTransactions = transactionsData?.booked || [];

  const flattenedTransactions = bookedTransactions.map(transaction => ({
    ...transaction,
    _id: transaction.transactionId,
    amount: transaction.transactionAmount.amount,
    currency: transaction.transactionAmount.currency
  }));

  // Define the columns for the transaction data
  const transactionColumns = [
    { field: 'transactionId', headerName: 'Transaction ID', flex: 1 },
    { field: 'bookingDate', headerName: 'Booking Date', flex: 1 },
    { field: 'valueDate', headerName: 'Value Date', flex: 1 },
    { field: 'amount', headerName: 'Amount', flex: 1, valueGetter: (params) => `${params.row.transactionAmount.amount} ${params.row.transactionAmount.currency}` },
    { field: 'description', headerName: 'Description', flex: 2, valueGetter: (params) => params.row.remittanceInformationUnstructured || '' },
  ];


  const invoiceColumns = [
    {
      field: "invoice",
      flex: 1,
      renderHeader: () => (
        <strong>
          {"Invoice"}
        </strong>
      ),
    },
    {
      field: "status",
      flex: 1.5,
      renderHeader: () => (
        <strong>
          {"Issued / Due"}
        </strong>
      ),
      renderCell: (params) => {
        return (
          renderStatusChip(params.row.status)
        )
      },
    },
    {
      field: "amount",
      flex: 0.5,
      renderHeader: () => (
        <strong>
          {"Amount"}
        </strong>
      ),
      renderCell: (params) => {
        return (
          renderPaymentChip(params.row.payment)
        )
      },
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

  return (
    <DataGridPro
      loading={!flattenedTransactions}
      getRowId={(row) => row._id}
      rows={flattenedTransactions}
      columns={transactionColumns}
      disableColumnResize
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
      }}
    />
  );
};

export default FundsDataGrid;

import React, { useState, useEffect } from 'react';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { CircularProgress, Box, Button } from '@mui/material';
import { useGetTransactionsQuery } from 'state/api';
import { renderStatusChip, renderPaymentChip } from 'utils/transaction';

const FundsDataGrid = ({ user, tabValue }) => {
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

  if (isLoading) return <CircularProgress />;
  if (isError || !data) return <Box>Error loading data.</Box>;

  const invoiceColumns = [
    {
      field: "invoice",
      flex: 1,
      headerName: "Invoice",
    },
    {
      field: "status",
      flex: 1.5,
      headerName: "Issued / Due",
      renderCell: (params) => {
        return (
          renderStatusChip(params.row.status)
        )
      },
    },
    {
      field: "amount",
      flex: 0.5,
      headerName: "Amount",
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

  const columns = tabValue === 0 ? invoiceColumns : repaymentColumns;

  return (
    <DataGridPro
      loading={isLoading || data.transactions.length === 0}
      getRowId={(row) => row["_id"]}
      rows={(data && data.transactions) || []}
      columns={columns}
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
          fontSize: '0.875rem',
          fontWeight: 'semibold',
          color: 'black',
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

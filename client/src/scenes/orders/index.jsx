import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetTransactionsQuery, useDeleteTransactionMutation } from 'state/api';
import { Box, Button, CircularProgress } from '@mui/material';
import { DataGridPro } from '@mui/x-data-grid-pro';

import Header from 'components/Header';
import DataGridCustomToolbar from 'components/DataGridCustomToolbar';
import ActionMenu from 'components/ActionMenu';
import FlexBetween from 'components/FlexBetween';

import { getLoggedInUser } from 'utils/token';
import { renderStatusChip, renderPaymentChip, formatDate } from 'utils/transaction';

const Orders = () => {
  const user = getLoggedInUser();
  const navigate = useNavigate();

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [sort, setSort] = useState({});
  const [search, setSearch] = useState("");

  const [searchInput, setSearchInput] = useState("");

  /* Potentially get rid of this and call it once in useEffect */
  const { data, isLoading, isError } = useGetTransactionsQuery({
    userId: user.id,
    page,
    pageSize,
    sort: JSON.stringify(sort),
    search,
  });

  console.log('Data from Orders: ', data);

  const [deleteTransaction] = useDeleteTransactionMutation();

  if (isLoading) {
    return <CircularProgress />;
  };

  if (isError || !data) {
    return <Box>Error loading transactions.</Box>;
  };

  const handleCreateOrder = () => {
    navigate('/orders/create');
  };

  const handleViewOrder = (id) => {
    navigate(`/orders/view/${id}`);
  };

  const handleUpdateOrder = (id) => {
    navigate(`/orders/update/${id}`);
  };

  const handleDeleteOrder = async (id) => {
    try {
      await deleteTransaction({ id }).unwrap();
    } catch (error) {
      console.log('Error during delete.', error);
    };
  };

  if (data.transactions.length === 0) {
    return (
      <Box m="1.5rem 2.5rem">
        <FlexBetween>
          <Header title="ORDERS" />
          <Button
            variant="primary"
            size="small"
            onClick={handleCreateOrder}
          >
            Create New Transaction
          </Button>
        </FlexBetween>
      </Box>
    );
  };

  const columns = [
    {
      field: "_id",
      flex: 1,
      renderHeader: () => (
        <strong>
          {"ID"}
        </strong>
      ),
    },
    {
      field: "seller",
      flex: 1,
      renderHeader: () => (
        <strong>
          {"Seller"}
        </strong>
      ),
    },
    {
      field: "initialDate",
      flex: 1,
      renderHeader: () => (
        <strong>
          {"Date"}
        </strong>
      ),
      valueFormatter: (params) => formatDate(params.value),
    },
    {
      field: "expiryDate",
      flex: 1,
      renderHeader: () => (
        <strong>
          {"Expiry Date"}
        </strong>
      ),
      valueFormatter: (params) => formatDate(params.value)
    },
    {
      field: "cost",
      flex: 1,
      renderHeader: () => (
        <strong>
          {"Cost"}
        </strong>
      ),
    },
    {
      field: "credit",
      flex: 1,
      renderHeader: () => (
        <strong>
          {"Credit"}
        </strong>
      ),
    },
    {
      field: "status",
      flex: 1,
      renderHeader: () => (
        <strong>
          {"Status"}
        </strong>
      ),
      renderCell: (params) => {
        return (
          renderStatusChip(params.row.status)
        )
      },
    },
    {
      field: "payment",
      flex: 0.75,
      renderHeader: () => (
        <strong>
          {"Payment"}
        </strong>
      ),
      renderCell: (params) => {
        return (
          renderPaymentChip(params.row.payment)
        )
      },
    },
    {
      field: "actions",
      headerName: '',
      sortable: false,
      flex: 0.10,
      renderCell: (params) => {
        return (
          <ActionMenu
            data={params.row}
            onViewOrder={() => handleViewOrder(params.row._id)}
            onUpdateOrder={() => handleUpdateOrder(params.row._id)}
            onDeleteOrder={() => handleDeleteOrder(params.row._id)}
          />
        )
      },
    },
  ];

  const dataGridStyles = {
    border: 'none',
    '& .MuiDataGrid-columnHeaders': {
      borderBottom: '1px solid rgba(224, 224, 224, 1)',
    },
    '& .MuiDataGrid-row': {
      borderBottom: '1px solid rgba(224, 224, 224, 0.1)',
      fontWeight: '550',
    },
  };

  return (
    <Box m="1.5rem 2.5rem">
      <FlexBetween>
        <Header title="ORDERS" />
        <Button
          variant="primary"
          size="small"
          onClick={handleCreateOrder}
        >
          Create New Transaction
        </Button>
      </FlexBetween>

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
        slots={{ Toolbar: DataGridCustomToolbar }}
        slotProps={{
          toolbar: { searchInput, setSearchInput, setSearch }
        }}
        sx={dataGridStyles}
      />
    </Box>
  );
};

export default Orders;
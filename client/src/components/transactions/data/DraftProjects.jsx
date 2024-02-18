import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDeleteTransactionMutation } from 'state/api';
import { DataGridPro } from '@mui/x-data-grid-pro';
import ActionMenu from 'components/ActionMenu';
import DataGridCustomToolbar from 'components/DataGridCustomToolbar';
import { Box, Typography } from '@mui/material';

const DraftProjects = ({ data }) => {
  const navigate = useNavigate();

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [sort, setSort] = useState({});

  const draftProjects = data?.transactions.filter(tr => tr.status === 0) || [];
  console.log('draft projects: ', draftProjects);

  const [deleteTransaction] = useDeleteTransactionMutation();

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

  const columns = [
    {
      field: "_id",
      flex: 1.5,
      renderHeader: () => (
        <strong>
          {"Project"}
        </strong>
      ),
    },
    {
      field: "cost",
      flex: 0.75,
      renderHeader: () => (
        <strong>
          {"Project Value"}
        </strong>
      ),
    },
    {
      field: "projectPurchases",
      flex: 1,
      renderHeader: () => (
        <strong>
          {"No. Purchases"}
        </strong>
      ),
      renderCell: (params) => (
        params.row.products.length
      ),
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

  if (draftProjects.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', marginTop: '20px' }}>
        <Typography>No draft projects found.</Typography>
      </Box>
    );
  };

  return (
    <DataGridPro
      loading={!data}
      getRowId={(row) => row["_id"]}
      rows={draftProjects}
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
      sx={dataGridStyles}
    />
  )
};

export default DraftProjects;
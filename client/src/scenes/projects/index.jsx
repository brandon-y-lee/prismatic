import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetProjectsQuery, useGetTransactionsQuery } from 'state/api';
import { Box, Button, CircularProgress, useMediaQuery } from '@mui/material';
import { DataGridPro } from '@mui/x-data-grid-pro';

import Header from 'components/Header';
import FlexBetween from 'components/FlexBetween';
import ActionMenu from 'components/ActionMenu';
import DataGridCustomToolbar from 'components/DataGridCustomToolbar';

import { getLoggedInUser } from 'utils/token';

const Projects = () => {
  const user = getLoggedInUser();
  const navigate = useNavigate();

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [sort, setSort] = useState({});
  const [search, setSearch] = useState("");

  const { data, isLoading, isError } = useGetProjectsQuery({
    page,
    pageSize,
    sort: JSON.stringify(sort),
    search,
    userId: user.userId,
  })

  const handleCreateProject = () => {
    navigate('/projects/create');
  };

  const handleAllProjects = () => {
    console.log("All Projects Clicked.");
  };

  const generateButton = (label, onClick, variant, bcolor, color) => (
    <Button
      variant={variant}
      size="large"
      onClick={onClick}
      sx={{
        transition: 'box-shadow 0.3s',
        boxShadow: 'none',
        backgroundColor: bcolor,
        borderColor: bcolor,
        borderWidth: '1px',
        borderStyle: 'solid',
        color: color,
        padding: '0.5rem 1rem',
        height: '100%',
        '&:hover': {
          boxShadow: theme => theme.shadows[3],
          backgroundColor: bcolor,
          borderColor: bcolor,
          borderWidth: '1px',
          borderStyle: 'solid',
          color: color,
        },
      }}
    >
      {label}
    </Button>
  );

  const columns = [
    {
      field: "title",
      flex: 1,
    },
    {
      field: "summary",
      flex: 2,
    },
    {
      field: "status",
      flex: 0.75,
    },
    {
      field: "actions",
      headerName: '',
      sortable: false,
      width: 50,
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
    }
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

  const handleViewOrder = (id) => {
    navigate(`/projects/view/${id}`);
  };

  const handleUpdateOrder = (id) => {
    navigate(`/projects/update/${id}`);
  };

  const handleDeleteOrder = async (id) => {

  };

  if (isLoading) {
    return <CircularProgress />;
  };

  if (isError || !data || data.length === 0) {
    return <Box>Error loading transactions.</Box>;
  };

  return (
    <Box m="1.5rem 2.5rem">
      <FlexBetween>
        <Header title="Projects" />
        <FlexBetween sx={{ gap: 3 }}>
          {generateButton("All Projects", handleAllProjects, 'outlined', 'grey.300', 'grey.600')}
          {generateButton("New Project", handleCreateProject, 'outlined', '#1677FF', 'white')}
        </FlexBetween>
      </FlexBetween>

      <Box my="1rem">
        <DataGridPro
          loading={!data}
          getRowId={(row) => row["_id"]}
          rows={data && data.projects}
          columns={columns}
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
      </Box>
    </Box>
  );
};

export default Projects;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDeleteProjectMutation, useGetProjectsQuery } from 'state/api';
import { Box, Button, CircularProgress, Divider, useMediaQuery, useTheme } from '@mui/material';
import { DataGridPro } from '@mui/x-data-grid-pro';

import Header from 'components/Header';
import FlexBetween from 'components/FlexBetween';
import ActionMenu from 'components/ActionMenu';
import DataGridCustomToolbar from 'components/DataGridCustomToolbar';

import { getLoggedInUser } from 'utils/token';

const Projects = () => {
  const user = getLoggedInUser();
  const navigate = useNavigate();
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");

  const { data, isLoading, isError } = useGetProjectsQuery({ userId: user.userId });

  const [deleteProject] = useDeleteProjectMutation();

  const handleCreateProject = () => {
    navigate('/projects/create');
  };

  const handleAllProjects = () => {
    console.log("All Projects Clicked.");
  };

  const handleViewProject = (id) => {
    navigate(`/projects/view/${id}`);
  };

  const handleUpdateProject = (id) => {
    navigate(`/projects/update/${id}`);
  };

  const handleDeleteProject = async (id) => {
    try {
      await deleteProject({ id }).unwrap();
      console.log(`Project ${id} deleted successfully.`);
    } catch (error) {
      console.error('Error deleting the project: ', error.message);
    }
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
      headerName: "Title",
      flex: 1,
    },
    {
      field: "summary",
      headerName: "Summary",
      flex: 2,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.75,
    },
    {
      field: "actions",
      headerName: '',
      sortable: false,
      width: 50,
      renderCell: (params) => (
        <ActionMenu
          data={params.row}
          onView={() => handleViewProject(params.row._id)}
          onUpdate={() => handleUpdateProject(params.row._id)}
          onDelete={() => handleDeleteProject(params.row._id)}
        />
      )
    }
  ];

  if (isLoading) {
    return <CircularProgress />;
  };

  return (
    <Box sx={{ mb: '2.5rem' }}>
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        sx={{
          "& > div": { 
            gridColumn: isNonMediumScreens ? undefined : "span 12",
          },
        }}
      >
        <Box sx={{ gridColumn: 'span 12', mt: '1.5rem', mb: '1rem', mx: '2.5rem' }}>
          <FlexBetween>
            <Header title="Projects" />
            <FlexBetween sx={{ gap: 3 }}>
              {generateButton("All Projects", handleAllProjects, 'outlined', 'grey.300', 'grey.600')}
              {generateButton("New Project", handleCreateProject, 'outlined', '#1677FF', 'white')}
            </FlexBetween>
          </FlexBetween>
        </Box>

        <Box sx={{ gridColumn: "span 12" }}>
          <Divider />
        </Box>

        <Box sx={{ gridColumn: "span 12", height: '60vh', m: "1.5rem 2.5rem" }}>
          <DataGridPro
            loading={!data}
            getRowId={(row) => row['_id']}
            rows={data && data.projects}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
            hideFooter
            hideFooterPagination
            sx={{
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#f6f6f6',
              },
              '& .MuiDataGrid-row': {
                fontWeight: '550',
              },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Projects;
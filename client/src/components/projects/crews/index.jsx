  import React, { useState } from 'react';
  import { useNavigate, useParams } from 'react-router-dom';
  import { Avatar, Box, Paper, Typography, Button, Stack, useMediaQuery, Grid, IconButton, Divider, useTheme } from '@mui/material';
  import { Add, MoreHorizOutlined, CreateOutlined, Circle, GroupOutlined } from '@mui/icons-material';
  import { DataGridPro } from '@mui/x-data-grid-pro';
  import ActionMenu from 'components/ActionMenu';
  import FlexBetween from 'components/FlexBetween';
  import AddCrew from './AddCrew';
  import { useDeleteCrewMutation, useGetCrewsQuery } from 'state/api';

  const Crews = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const { id: projectId } = useParams();
    const [openAddCrewDialog, setOpenAddCrewDialog] = useState(false);
    const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");

    const { data: crews, isLoading: isCrewsLoading, error } = useGetCrewsQuery({ projectId: projectId });
    console.log('crews: ', crews);
    const [deleteCrew] = useDeleteCrewMutation();

    const handleAddCrew = () => {
      setOpenAddCrewDialog(true);
    };

    const handleCloseAddCrew = () => {
      setOpenAddCrewDialog(false);
    };

    const handleViewCrew = (crewId) => {
      navigate(`/projects/view/${projectId}/crews/${crewId}`);
    };

    const handleDeleteCrew = async (id) => {
      try {
        await deleteCrew({ id }).unwrap();
        console.log(`Crew ${projectId} deleted successfully.`);
      } catch (error) {
        console.log('Error during delete.', error);
      }
    };

    const columns = [
      { 
        field: 'name',
        headerName: 'Crew Name',
        flex: 1,
        minWidth: 150 },
      { 
        field: 'lead',
        headerName: 'Crew Lead',
        flex: 1, 
        minWidth: 200,
        renderCell: (params) => params.value.name,
      },
      { 
        field: 'size',
        headerName: 'Size',
        flex: 0.5,
        minWidth: 100,
        valueGetter: (params) => params.row.members.length,
      },
      {
        field: "actions",
        headerName: '',
        sortable: false,
        flex: 0.2,
        minWidth: 25,
        renderCell: (params) => (
          <ActionMenu
            data={params.row}
            onView={() => handleViewCrew(params.row._id)}
            onDelete={() => handleDeleteCrew(params.row._id)}
          />
        )
      },
    ];

    return (  
      <Box sx={{ minHeight: 'calc(100vh - 8rem)' }}>
        <Box
          display="grid"
          gridTemplateColumns="repeat(12, 1fr)"
          sx={{
            mb: '1.5rem',
            gap: '1.5rem',
            "& > div": { 
              gridColumn: isNonMediumScreens ? undefined : "span 12",
            },
          }}
        >
          <Paper
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gridColumn: 'span 12',
              transition: 'box-shadow 0.3s',
              boxShadow: 'none',
              borderColor: 'grey.300',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderRadius: '16px',
              padding: '1.5rem 2rem',
              gap: '1rem',
              '&:hover': {
                boxShadow: theme => theme.shadows[3],
              },
            }}
          >
            <FlexBetween>
              {/* Title "Tasks" */}
              <Typography variant='h5' fontWeight={550}>
                Crews
              </Typography>
              <Button
                startIcon={<Add />}
                color='info'
                sx={{ fontWeight: 600 }}
                onClick={handleAddCrew}
              >
                Add Crew
              </Button>
            </FlexBetween>

            <Box sx={{ height: '60vh', width: '100%' }}>
              <DataGridPro
                loading={isCrewsLoading}
                getRowId={(row) => row._id}
                rows={crews || []}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                disableSelectionOnClick
                hideFooter
                hideFooterPagination
                sx={{
                  '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: theme.palette.background.alt,
                  },
                }}
              />
            </Box>

            <AddCrew open={openAddCrewDialog} onClose={handleCloseAddCrew} />
          </Paper>
        </Box>
      </Box>
    );
  }

  export default Crews;

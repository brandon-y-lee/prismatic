import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, List, ListItem, ListItemIcon, ListItemText, IconButton, Paper, Typography, Tabs, Tab, useMediaQuery, useTheme, Button } from '@mui/material';
import { EditOutlined, RadioButtonUncheckedOutlined, CheckCircleOutlined, Add } from '@mui/icons-material';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';
import FlexBetween from 'components/FlexBetween';
import CreateBudget from './CreateBudget';

const Budget = () => {
  const id = useParams();
  const navigate = useNavigate();

  const handleCreateBudget = () => {
    navigate(`/projects/view/${id.id}/budget/new`);
  };

  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 10,
    editable: true,
  });

  return (  
    <Box sx={{ mb: '2.5rem' }}>
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        sx={{
          gap: '1.5rem',
          "& > div": { 
            gridColumn: "span 12",
          },
        }}
      >
        <Paper
          sx={{
            display: 'flex',
            flexDirection: 'column',
            transition: 'box-shadow 0.3s',
            boxShadow: 'none',
            borderColor: 'grey.300',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderRadius: '16px',
            padding: '1.5rem 2rem',
            mb: '1rem',
            gap: '1rem',
            '&:hover': {
              boxShadow: theme => theme.shadows[3],
            },
          }}
        >
          <FlexBetween>
            {/* Title "Tasks" */}
            <Typography variant='h5' fontWeight={550} marginBottom={1}>
              Budget
            </Typography>
            <Button
              startIcon={<Add />}
              color='info'
              sx={{ fontWeight: 600 }}
              onClick={handleCreateBudget}
            >
              Create Budget
            </Button>
          </FlexBetween>

          <DataGridPro
            {...data}
            loading={data.rows.length === 0}
            rowHeight={38}
            checkboxSelection
            disableRowSelectionOnClick
          />

        </Paper>
      </Box>
    </Box>
  );
}

export default Budget;

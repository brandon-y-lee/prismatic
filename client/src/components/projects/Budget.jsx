import React, { useState } from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText, IconButton, Paper, Typography, Tabs, Tab, useMediaQuery, useTheme, Button } from '@mui/material';
import { EditOutlined, RadioButtonUncheckedOutlined, CheckCircleOutlined, Add } from '@mui/icons-material';
import FlexBetween from 'components/FlexBetween';


const Budget = () => {
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
  const [activeTab, setActiveTab] = useState(0);

  const handleCreate = () => {

  }

  return (  
    <Box sx={{ minHeight: 'calc(100vh - 3rem)' }}>
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
            >
              Create Budget
            </Button>
          </FlexBetween>

        </Paper>
      </Box>
    </Box>
  );
}

export default Budget;

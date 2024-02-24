import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button, Paper } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ViewForm from 'components/transactions/view/ViewForm';
import PageLoader from 'components/PageLoader';

import { useViewTransactionQuery } from 'state/api';

const ViewProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: transactionData, isLoading } = useViewTransactionQuery(id);
  console.log("Transaction Data: ", transactionData);

  if (isLoading) {
    return <PageLoader />;
  }

  if (!transactionData) {
    return <Box>Order not found.</Box>;
  }

  return (
    <Box display="flex" flexDirection="column" m="1.5rem 2.5rem 1.5rem 2.5rem" gap="1rem">
      <div>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ color: '#000' }}>
          Back
        </Button>        
        <Box sx={{ flexGrow: 1 }} />
      </div>
      <Paper
        sx={{
          transition: 'box-shadow 0.3s',
          boxShadow: 'none',
          borderColor: 'grey.300',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderRadius: '16px',
          marginBottom: '2.5rem',
          padding: '1.5rem 2.5rem',
          '&:hover': {
            boxShadow: theme => theme.shadows[3],
          },
        }}
      >
        <ViewForm transactionData={transactionData} />
      </Paper>
    </Box>
  );
};

export default ViewProject;

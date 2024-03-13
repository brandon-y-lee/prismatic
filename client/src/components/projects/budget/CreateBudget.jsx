import React from 'react';
import { Box, Button, TextField, Paper, Typography } from '@mui/material';

const CreateBudget = () => {
  return (
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
      <Typography variant='h5' fontWeight={550} marginBottom={1}>
        Create Budget Plan
      </Typography>
    </Paper>
  );
};

export default CreateBudget;

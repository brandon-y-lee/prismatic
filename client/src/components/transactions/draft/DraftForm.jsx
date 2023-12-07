import React from 'react';
import { Box, Button, Divider } from '@mui/material';
import DraftHeader from './DraftHeader';
import DraftBody from './DraftBody';
import DraftSummary from './DraftSummary';

const DraftForm = ({ isUpdate = false, transactionId = null, status = null, formValues, setFormValues, items, setItems, onSubmit }) => {
  const handleSubmit = () => {
    console.log("Order form button pressed: ", formValues, items);
    onSubmit(formValues, items);
  };

  return (
    <Box m="1.5rem 2.5rem">
      <DraftHeader isUpdate={isUpdate} transactionId={transactionId} status={status} />
      <Divider />
      <DraftBody formValues={formValues} setFormValues={setFormValues} />
      <Divider variant="middle" />
      <DraftSummary items={items} setItems={setItems} />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
      >
        {isUpdate ? 'Update Order' : 'Save Order'}
      </Button>
    </Box>
  );
};

export default DraftForm;

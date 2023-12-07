import React from 'react';
import ViewHeader from './ViewHeader';
import ViewBody from './ViewStats';
import ViewClient from './ViewClient';
import ViewSummary from './ViewSummary';
import { statusMap } from 'utils/transaction';
import { Divider } from '@mui/material';

const ViewForm = ({ transactionData }) => {

  const status = statusMap[transactionData.status];

  return (
    <div>
      <ViewHeader transactionId={transactionData._id} status={transactionData.status} />
      <ViewBody cost={transactionData.cost} status={status} />
      <Divider />
      <ViewClient userId={transactionData.sellerId} />
      <Divider />
      <ViewSummary items={transactionData.products} />
    </div>
  );
};

export default ViewForm;

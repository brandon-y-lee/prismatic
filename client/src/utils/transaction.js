import { Chip } from '@mui/material';

export const statusMap = {
  0: 'Draft',
  1: 'Pending',
  2: 'Processed',
  3: 'En Route',
  4: 'Received'
};

export const paymentMap = {
  0: 'Unpaid',
  1: 'Partial',
  2: 'Paid'
};

export const renderStatusChip = (status) => {
  const backgroundColor = status === 'Draft' ? 'lightgrey' :
  status === 'Action Required' ? 'darkorange' :
  status === 'Active' ? 'blue' :
  status === 'Inactive' ? 'grey' : undefined;

  return (
    <Chip label={status} sx={{ backgroundColor, color: 'white', fontWeight: 550 }} />
  );
};

export const renderPaymentChip = (paymentEnum) => {
  const payment = mapPayment(paymentEnum);
  const backgroundColor = payment === 'Unpaid' ? 'red' :
                          payment === 'Partial' ? 'orange' :
                          payment === 'Paid' ? 'green' : undefined;

  return (
    <Chip label={payment} sx={{ backgroundColor, color: 'white' }} />
  );
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

export function mapStatus(statusEnum) {
  return statusMap[statusEnum] || 'Unknown';
};

export function mapPayment(paymentEnum) {
  return paymentMap[paymentEnum] || 'Unknown';
};



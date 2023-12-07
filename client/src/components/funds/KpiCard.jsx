import React from 'react';
import { Card, CardContent, Typography, LinearProgress} from '@mui/material';

const KpiCard = ({ title, metric, progress, target, paymentDate, showPaymentDate = false, showTarget = false, showProgressBar = false }) => {
  return (
    <Card sx={{
      transition: 'box-shadow 0.3s',
      boxShadow: 'none',
      borderColor: 'grey.300',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderRadius: '16px',
      padding: '0.5rem 1rem',
      height: '100%',
      '&:hover': {
        boxShadow: theme => theme.shadows[3],
      },
    }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: '550', mb: 1 }}>{title}</Typography>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: '550', mb: 1 }}>{metric}</Typography>
        {showTarget && (
          <Typography variant="body1" sx={{ mb: 1.5 }}>{`of ${target}`}</Typography>
        )}
        {showProgressBar && (
          <LinearProgress variant="determinate" value={progress} color={'secondary'} />
        )}
        {showPaymentDate && (
          <Typography variant="h5" gutterBottom sx={{ fontWeight: '500' }}>{paymentDate}</Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default KpiCard;
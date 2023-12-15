import React from 'react';
import { Card, CardActionArea, CardContent, Typography} from '@mui/material';
import { format, parseISO, isValid } from 'date-fns';

const RepaymentKpi = ({ repaymentDetails, onCardClick }) => {
  const formatDate = (date) => {
    const parsedDate = parseISO(date);
    return isValid(parsedDate) ? format(parsedDate, 'MMM-d-yyyy') : '';
  };

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
      <CardActionArea onClick={onCardClick} sx={{ height: '100%' }}>
        <CardContent sx={{ 
          display: 'flex',
          flexDirection: 'column',
          gap: 1
        }}>
          <Typography variant="h6" sx={{ fontWeight: '550' }}>Upcoming Payment</Typography>
          <Typography variant="h3" sx={{ fontWeight: '550' }}>${repaymentDetails?.nextRepaymentAmount}</Typography>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: '500' }}>{formatDate(repaymentDetails?.nextRepaymentDate)}</Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default RepaymentKpi;
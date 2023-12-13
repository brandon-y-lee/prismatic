import React from 'react';
import { Card, CardActionArea, CardContent, Typography} from '@mui/material';

const RepaymentKpi = ({ title, metric, paymentDate, onCardClick, isExpanded }) => {
  
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
      <CardActionArea onClick={onCardClick}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: '550', mb: 1 }}>{title}</Typography>
          <Typography variant="h3" gutterBottom sx={{ fontWeight: '550', mb: 1 }}>{metric}</Typography>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: '500' }}>{paymentDate}</Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default RepaymentKpi;
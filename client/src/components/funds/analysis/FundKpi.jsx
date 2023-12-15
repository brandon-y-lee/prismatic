import React from 'react';
import { Card, CardContent, Typography, LinearProgress, CardActionArea } from '@mui/material';

const FundKpi = ({ title, metric, progress, target, onCardClick }) => {

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
          <Typography variant="h6" sx={{ fontWeight: '550' }}>{title}</Typography>
          <Typography variant="h3" sx={{ fontWeight: '550' }}>{metric}</Typography>
          <Typography variant="body1" gutterBottom>{`of ${target}`}</Typography>
          <LinearProgress variant="determinate" value={progress} color={'secondary'} />
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default FundKpi;
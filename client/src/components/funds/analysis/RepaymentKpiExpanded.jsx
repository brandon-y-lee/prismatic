import React from 'react';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const RepaymentKpiExpanded = ({ expandedCard, onClose }) => {
  // Data format should be an array of objects with date, historical and predicted values
  const data = [
    { date: 'Jan 1', historical: 4000, predicted: 2400 },
    { date: 'Jan 2', historical: 3000, predicted: 1398 },
  ]

  const open = expandedCard === 'repayment';

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Cash Flow Insights</DialogTitle>
      <DialogContent>
        <LineChart
          width={600}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="historical" stroke="#8884d8" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="predicted" stroke="#82ca9d" />
        </LineChart>
      </DialogContent>
    </Dialog>
  );
};

export default RepaymentKpiExpanded;

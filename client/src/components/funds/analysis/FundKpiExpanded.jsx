import React from 'react';
import { Box, Dialog, DialogContent, DialogTitle, Typography, useTheme, useMediaQuery } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import KpiBox from './KpiBox';
import { BarChartOutlined, CreditScoreOutlined, CurrencyExchangeOutlined, WarningAmberOutlined } from '@mui/icons-material';

const FundKpiExpanded = ({ expandedCard, onClose }) => {
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");

  // Data format should be an array of objects with date, historical and predicted values
  const data = [
    { date: 'Jan 1', historical: 3957, predicted: 4000 },
    { date: 'Jan 2', historical: 2948, predicted: 3000 },
    { date: 'Jan 3', historical: 2014, predicted: 2000 },
    { date: 'Jan 4', historical: 2481, predicted: 2500 },
    { date: 'Jan 5', historical: 2781, predicted: 2800 },
    { date: 'Jan 5', historical: 3018, predicted: 3000 },
  ];

  const open = expandedCard === 'fund';

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle variant='h4' sx={{ textAlign: 'center', fontWeight: '500', mt: 2 }}>
        <span>Cash Flow Insights</span>
      </DialogTitle>
      <DialogContent sx={{ mb: 2 }}>
        <Box
          display='grid'
          gridTemplateColumns="repeat(12, 1fr)"
          gridAutoRows="100px"
          gap="20px"
          sx={{ "& > div": { gridColumn: isNonMediumScreens ? undefined : "span 12" }, mx: 2, my: 2 }}
        >
          <KpiBox
            title='Cash Flow'
            value={30000}
            increase="+5%"
            icon={
              <CurrencyExchangeOutlined
                sx={{ fontSize: "26px" }}
              />
            }
          />
          <KpiBox
            title='Account Balance'
            value={21080}
            increase="+8%"
            icon={
              <BarChartOutlined
                sx={{ fontSize: "26px" }}
              />
            }
          />
          <KpiBox
            title='Funding Received'
            value={8450}
            increase="+9%"
            icon={
              <CreditScoreOutlined
                sx={{ fontSize: "26px" }}
              />
            }
          />
          <KpiBox
            title='Risk Factor'
            value={35}
            increase="+3%"
            icon={
              <WarningAmberOutlined
                sx={{ fontSize: "26px" }}
              />
            }
          />
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', mt: 2, mb: 2, gap: 0.5 }}>
          <Typography variant="h6" sx={{ fontWeight: '550' }}>Balance history and prediction</Typography>
          <Typography variant="h4" sx={{ fontWeight: '550' }}>$21,345</Typography>
        </Box>

        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={data}
            margin={{
              top: 10,
              right: 20,
              left: 0,
              bottom: 10,
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
        </ResponsiveContainer>

      </DialogContent>
    </Dialog>
  );
};

export default FundKpiExpanded;

import React from 'react';
import { Box, Button, Checkbox, Tabs, Tab, Typography, FormControlLabel } from '@mui/material';
import { addWeeks, format } from 'date-fns';

const ModalSummary = ({ amount, tabValue, handleTabChange, agreementChecked, handleAgreementChange, handleConfirm }) => {
  const numericAmount = Math.abs(parseFloat(amount));

  // Calculate weekly amounts and fees for both 12 and 24 weeks
  const weeklyBase12 = numericAmount / 12;
  const weeklyBase24 = numericAmount / 24;
  const weeklyFee12 = weeklyBase12 * 0.077;
  const weeklyFee24 = weeklyBase24 * 0.173;

  const weeklyTotal12 = parseFloat((weeklyBase12 + weeklyFee12).toFixed(2));
  const weeklyTotal24 = parseFloat((weeklyBase24 + weeklyFee24).toFixed(2));

  // Decide values based on selected tab
  const weeks = tabValue === 0 ? 12 : 24;
  const weeklyFee = tabValue === 0 ? weeklyFee12 : weeklyFee24;
  const weeklyTotal = tabValue === 0 ? weeklyTotal12 : weeklyTotal24;
  const totalRepayment = (weeklyTotal * weeks);

  // Calculate dates
  const now = new Date();
  const firstPaymentDate = addWeeks(now, 1);
  const lastPaymentDate = addWeeks(now, weeks);

  return (
    <Box display='flex' flexDirection='column' px={4} gap={2}>
      <Tabs value={tabValue} onChange={handleTabChange} centered sx={{
          backgroundColor: 'transparent',
          '.MuiTabs-indicator': {
            backgroundColor: '#1677FF',
          },
        '.MuiTab-root': {
          color: 'grey',
          '&:hover': {
            color: 'black',
          },
          '&.Mui-selected': {
            color: 'black',
            backgroundColor: 'white',
            fontWeight: '550'
          },
        }
      }}>
        <Tab label={`12 weeks x ${weeklyTotal12.toFixed(2)}`} />
        <Tab label={`24 weeks x ${weeklyTotal24.toFixed(2)}`} />
      </Tabs>

      <Box px={3} mt={4} mb={3}>
        {[['Weekly fee', `$${weeklyFee.toFixed(2)}`],
          ['First payment due date', format(firstPaymentDate, 'PPP')],
          ['Last payment due date', format(lastPaymentDate, 'PPP')],
          ['Total repayment inc. fees', `$${totalRepayment.toFixed(2)}`]
        ].map(([label, value], index) => (
          <Typography key={index} variant="body1" gutterBottom display="flex" justifyContent="space-between" sx={{
            color: 'grey',
            '& > span:last-child': {
              color: 'black',
              fontWeight: '500',
            },
          }}>
            <span>{label}</span>
            <span>{value}</span>
          </Typography>
        ))}
      </Box>
      
      <Box display='flex' flexDirection='column' gap={3}>
        <FormControlLabel
          control={<Checkbox checked={agreementChecked} onChange={handleAgreementChange} color='default' />}
          label="I confirm that I have read and agree to the Credit Agreement."
          required
          sx={{ px: 3 }}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleConfirm}
          sx={{
            backgroundColor: '#1677FF',
            color: 'white',
            textTransform: 'capitalize',
            fontWeight: '525',
            height: '50px',
            borderRadius: '0px',
            '&:hover': {
              backgroundColor: '#0044cc',
            },
          }}
        >
          Confirm {weeks} Week Repayment Plan
        </Button>
      </Box>
    </Box>
  );
};

export default ModalSummary;
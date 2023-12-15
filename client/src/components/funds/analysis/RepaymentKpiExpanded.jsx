import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, List, ListItem, ListItemText, Divider, Typography } from '@mui/material';

const RepaymentKpiExpanded = ({ expandedCard, onClose, fundsData, repaymentDetails }) => {
  const formatDate = (date) => new Date(date).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric"
  });

  const [fundsForRepayment, setFundsForRepayment] = useState([]);
  const [totals, setTotals] = useState({ fees: 0, payment: 0 });

  useEffect(() => {
    if (expandedCard === 'repayment' && fundsData && repaymentDetails) {
      console.log('fundsData: ', fundsData);
      const filteredFunds = fundsData.filter(fund =>
        repaymentDetails.nextRepaymentIds.includes(fund.id)
      );

      let totalFees = 0;
      let totalPayment = 0;

      filteredFunds.forEach(fund => {
        totalFees += fund.weeklyFee;
        totalPayment += fund.weeklyInstallment;
      });

      setFundsForRepayment(filteredFunds);
      setTotals({ fees: totalFees, payment: totalPayment });
    }
  }, [expandedCard, fundsData, repaymentDetails]);

  const fundItems = fundsForRepayment.map((fund, index) => (
    <React.Fragment key={fund.id}>
      <ListItem>
        <ListItemText 
          primary={`${fund.paymentsRemaining}/${fund.repaymentPlan} payments left`}
          primaryTypographyProps={{ sx: { fontWeight: 600, pb: 0.5 } }}
          secondary={`Ends on ${formatDate(fund.expiryDate)}`}
        />
        <ListItemText 
          primary={`$${fund.nextPaymentAmount.toFixed(2)}`}
          primaryTypographyProps={{ sx: { fontWeight: 600, textAlign: 'right', pb: 0.5 } }}
          secondary="Repayment options"
          secondaryTypographyProps={{ sx: { color: '#1677FF', textAlign: 'right' } }}
        />
      </ListItem>
      {index !== fundsForRepayment.length - 1 && <Divider light variant='middle' sx={{ mx: 2 }} />}
    </React.Fragment>
  ));

  return (
    <Dialog open={expandedCard === 'repayment'} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle variant='h4' sx={{ textAlign: 'center', fontWeight: '500', mt: 2 }}>
        <span>Upcoming Payment</span>
        <Typography variant='subtitle1' component="div" sx={{ fontWeight: '400', pt: 0.5 }}>
          Debit due <strong>{formatDate(repaymentDetails.nextRepaymentDate)}</strong>
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ mb: 2 }}>
        <List sx={{ px: 2 }}>
          {fundItems}
          <Divider sx={{ pt: 2, mx: 2 }} />
          <ListItem sx={{ pt: 2 }}>
            <ListItemText primary="Fees" />
            <ListItemText 
              primary={`$${totals.fees.toFixed(2)}`} 
              primaryTypographyProps={{ sx: { textAlign: 'right' } }}
            />
          </ListItem>
          <ListItem sx={{ backgroundColor: '#E6F4FF' }}>
            <ListItemText 
              primary="Total payment"
              primaryTypographyProps={{ sx: { fontWeight: 600 } }}
            />
            <ListItemText 
              primary={`$${totals.payment.toFixed(2)}`} 
              primaryTypographyProps={{ sx: { fontWeight: 600, textAlign: 'right' } }}
            />
          </ListItem>
          <ListItem>
            <ListItemText 
              secondary="We make automatic weekly debits every Wednesday at 10:00am PST"
              secondaryTypographyProps={{ sx: { fontWeight: 400 } }}
            />
          </ListItem>
        </List>
      </DialogContent>
    </Dialog>
  );
};

export default RepaymentKpiExpanded;

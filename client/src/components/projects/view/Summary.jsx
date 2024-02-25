import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box } from '@mui/material';

const Summary = ({ items }) => {
  const TAX_RATE = 0.07;

  function ccyFormat(num) {
    return `${num.toFixed(2)}`;
  };

  function subtotal(items) {
    return items.map(({ totalCost }) => totalCost).reduce((sum, i) => sum + i, 0);
  };  

  const invoiceSubtotal = subtotal(items);
  const invoiceTaxes = TAX_RATE * invoiceSubtotal;
  const invoiceTotal = invoiceTaxes + invoiceSubtotal;

  return (
    <TableContainer component={Box}>
      <Table sx={{ minWidth: 700 }} aria-label="spanning table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold', padding: '20px 16px' }}>Product</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold', padding: '20px 16px' }}>Price</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold', padding: '20px 16px' }}>Quantity</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold', padding: '20px 16px' }}>Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.name}>
              <TableCell sx={{ fontWeight: 'bold', borderBottom: 'none' }}>{item.name}</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold', borderBottom: 'none' }}>{item.price}</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold', borderBottom: 'none' }}>{item.quantity}</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold', borderBottom: 'none' }}>{item.totalCost}</TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell colSpan={3} align="right" sx={{ fontWeight: 'bold', borderBottom: 'none' }}>
              Subtotal:
            </TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold', borderBottom: 'none' }}>
              {ccyFormat(invoiceSubtotal)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={3} align="right" sx={{ fontWeight: 'bold', borderBottom: 'none' }}>
              Tax:
            </TableCell>
            <TableCell align="right" style={{ fontWeight: 'bold', borderBottom: 'none' }}>
              {ccyFormat(invoiceTaxes)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={3} align="right" sx={{ fontWeight: 'bold', borderBottom: 'none' }}>
              Total:
            </TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold', borderBottom: 'none' }}>
              {ccyFormat(invoiceTotal)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Summary;
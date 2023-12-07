import React from 'react';
import { Button, Form, Input, InputNumber, Row, Col } from 'antd';
import { Table, TableBody, TableCell, TableContainer, TableRow, Box } from '@mui/material';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import "./draft.css";

const DraftSummary = ({ items, setItems }) => {
  const TAX_RATE = 0.07;

  function ccyFormat(num) {
    return `${num.toFixed(2)}`;
  };

  function subtotal(items) {
    return items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  };

  const invoiceSubtotal = subtotal(items);
  const invoiceTaxes = TAX_RATE * invoiceSubtotal;
  const invoiceTotal = invoiceTaxes + invoiceSubtotal;

  const handleAdd = () => {
    const newItem = { name: '', description: '', quantity: 1, price: 0 };
    setItems([...items, newItem]);
  };

  const handleRemove = index => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleItemChange = (index, field, value) => {
    console.log(`Updating item at index ${index}: ${field} = ${value}`);
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  return (
    <>
      {items.map((item, index) => (
        <Form layout="vertical" key={item._id || index}>
          <Row key={index} gutter={16} className="summary-section">
            <Col span={4}>
              <Form.Item label="Item Name">
                <Input
                  placeholder="Item Name"
                  value={item.name}
                  onChange={e => handleItemChange(index, 'name', e.target.value)}
                  style={{ fontWeight: 'normal', width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Item Description">
                <Input
                  placeholder="Description"
                  value={item.description}
                  onChange={e => handleItemChange(index, 'description', e.target.value)}
                  style={{ fontWeight: 'normal', width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label="Quantity">
                <InputNumber
                  min={1}
                  placeholder="Quantity"
                  value={item.quantity}
                  onChange={value => handleItemChange(index, 'quantity', value)}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label="Price">
                <InputNumber
                  placeholder="Price"
                  min={0}
                  formatter={value => `$ ${value}`}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  value={item.price}
                  onChange={value => handleItemChange(index, 'price', value)}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label="Total">
                <InputNumber
                  placeholder="Total"
                  readOnly
                  value={item.price * item.quantity}
                  formatter={value => `$ ${value}`}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={2}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Button
                  type="danger"
                  icon={<DeleteOutlined />}
                  onClick={() => handleRemove(index)}
                />
              </div>
            </Col>
          </Row>
        </Form>
      ))}
      <Button className="button-section" type="dashed" onClick={handleAdd} block icon={<PlusOutlined />}>
        Add Product
      </Button>
      <TableContainer component={Box}>
        <Table aria-label="spanning table">
          <TableBody>
            <TableRow>
              <TableCell align="right" colSpan={7} sx={{ fontWeight: 'bold', borderBottom: 'none' }}>
                Subtotal:
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold', borderBottom: 'none' }}>
                {ccyFormat(invoiceSubtotal)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="right" colSpan={7} sx={{ fontWeight: 'bold', borderBottom: 'none' }}>
                Tax:
              </TableCell>
              <TableCell align="right" style={{ fontWeight: 'bold', borderBottom: 'none' }}>
                {ccyFormat(invoiceTaxes)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="right" colSpan={7} sx={{ fontWeight: 'bold', borderBottom: 'none' }}>
                Total:
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold', borderBottom: 'none' }}>
                {ccyFormat(invoiceTotal)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default DraftSummary;

import React, { useEffect } from 'react';
import { Row, Col, Form, Select, DatePicker } from 'antd';
import "./draft.css";

const { Option } = Select;

const DraftBody = ({ formValues, setFormValues }) => {

  console.log("Form Values at DraftBody: ", formValues);

  useEffect(() => {
    console.log("Updated Form Values: ", formValues);
  }, [formValues]);

  const onClientChange = (value) => {
    setFormValues({ ...formValues, client: value });
  };

  const onInitialDateChange = (date) => {
    setFormValues({ ...formValues, initialDate: date });
  };

  const onExpiryDateChange = (date) => {
    setFormValues({ ...formValues, expiryDate: date });
  };

  return (
    <Form layout="vertical">
    <Row gutter={[24, 24]} className="body-section">
      <Col className="gutter-row" span={8}>
        <Form.Item
          label="Client"
          name="client"
          rules={[{ required: true, message: 'Please select a client!' }]}
        >
          <Select
            showSearch
            placeholder="Select a client"
            optionFilterProp="children"
            onChange={onClientChange}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            style={{ width: '100%' }}
          >
            {/* These would be dynamically generated in a real application */}
            <Option value="Client A">Client A</Option>
            <Option value="Client B">Client B</Option>
          </Select>
        </Form.Item>
      </Col>

      <Col className="gutter-row" span={8}>
        <Form.Item 
          label="Date"
          name="initialDate"
          rules={[{ required: true, message: 'Please select a date!' }]}
        >
          <DatePicker
            value={formValues.initialDate}
            onChange={onInitialDateChange}
            style={{ width: '100%' }}
          />
        </Form.Item>
      </Col>

      <Col className="gutter-row" span={8}>
        <Form.Item
          label="Expire Date"
          name="expiryDate"
          rules={[{ required: true, message: 'Please select an expiry date!' }]}
        >
          <DatePicker
            value={formValues.expiryDate}
            onChange={onExpiryDateChange}
            style={{ width: '100%' }}
          />
        </Form.Item>
      </Col>
    </Row>
    </Form>
  );
};

export default DraftBody;

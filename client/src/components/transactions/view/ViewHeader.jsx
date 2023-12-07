import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { Box, Typography } from '@mui/material';
import { DeleteOutlineOutlined, EditOutlined, PictureAsPdfOutlined } from '@mui/icons-material';
import FlexBetween from 'components/FlexBetween';
import { useDeleteTransactionMutation } from 'state/api';
import { renderStatusChip } from 'utils/transaction';


const ViewHeader = ({ transactionId, status }) => {

  const navigate = useNavigate();
  const [deleteTransaction] = useDeleteTransactionMutation();

  const handleEdit = () => {
    navigate(`/orders/update/${transactionId}`);
  };

  const handleDownloadPDF = () => {
    
  };

  const handleDelete = async () => {
    const response = await deleteTransaction({ id: transactionId });
    if (response)
      navigate(`/orders`);
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, gap: '1rem' }}>
      <FlexBetween gap="1rem">
        <Typography variant="h5" fontWeight={600}>Order #{transactionId}</Typography>
        {renderStatusChip(status)}
      </FlexBetween>

      <FlexBetween gap="0.5rem">
        <Button
          startIcon={<EditOutlined />}
          sx={{ fontWeight: 600 }}
          onClick={handleEdit}
        >
          Edit
        </Button>

        <Button
          startIcon={<PictureAsPdfOutlined />}
          sx={{ fontWeight: 600 }}
          onClick={handleDownloadPDF}
        >
          Download PDF
        </Button>
        <Button
          startIcon={<DeleteOutlineOutlined />}
          sx={{ fontWeight: 600 }}
          onClick={handleDelete}
        >
          Delete
        </Button>
      </FlexBetween>
    </Box>
  );
};

export default ViewHeader;
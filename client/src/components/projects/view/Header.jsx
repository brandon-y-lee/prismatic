import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import { DeleteOutlineOutlined, EditOutlined, PictureAsPdfOutlined } from '@mui/icons-material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FlexBetween from 'components/FlexBetween';
import { useDeleteTransactionMutation } from 'state/api';
import { renderStatusChip } from 'utils/transaction';

const Header = ({ project, status }) => {

  const navigate = useNavigate();
  const [deleteTransaction] = useDeleteTransactionMutation();

  const handleEdit = () => {
    navigate(`/orders/update/${project}`);
  };

  const handleDownloadPDF = () => {
    
  };

  const handleDelete = async () => {
    const response = await deleteTransaction({ id: project });
    if (response)
      navigate(`/orders`);
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, gap: '1rem' }}>
      <FlexBetween gap="1rem">
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ color: 'info' }}>
          
        </Button>
        <Typography variant="h5" fontWeight={600}>{project}</Typography>
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

export default Header;
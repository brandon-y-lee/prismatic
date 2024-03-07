import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button, IconButton, Typography } from '@mui/material';
import { DeleteOutlineOutlined, EditOutlined, PictureAsPdfOutlined } from '@mui/icons-material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FlexBetween from 'components/FlexBetween';
import { useDeleteProjectMutation } from 'state/api';
import { renderStatusChip } from 'utils/transaction';

const Header = ({ project, summary, status }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [deleteProject] = useDeleteProjectMutation();

  const handleEdit = () => {
    navigate(`/orders/update/${project}`);
  };

  const handleDownloadPDF = () => {
    
  };

  const handleDelete = async () => {
    try {
      await deleteProject({ id }).unwrap();
      console.log(`Project ${id} deleted successfully.`);
      navigate(`/projects`);
    } catch (error) {
      console.error('Error deleting the project: ', error.message);
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, gap: '1rem' }}>
      <FlexBetween gap="1rem">
        <IconButton onClick={() => navigate('/projects')}>
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Typography variant="h5" fontWeight={600}>{project}</Typography>
          <Typography variant="subtitle1">{summary}</Typography>
        </Box>
        {renderStatusChip(status)}
      </FlexBetween>

      <FlexBetween gap="0.5rem">
        <Button
          startIcon={<EditOutlined />}
          color='warning'
          sx={{ fontWeight: 600 }}
          onClick={handleEdit}
        >
          Edit
        </Button>

        <Button
          startIcon={<PictureAsPdfOutlined />}
          color='info'
          sx={{ fontWeight: 600 }}
          onClick={handleDownloadPDF}
        >
          Download PDF
        </Button>
        <Button
          startIcon={<DeleteOutlineOutlined />}
          color='error'
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
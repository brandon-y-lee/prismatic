import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import { DeleteOutlineOutlined, EditOutlined, PictureAsPdfOutlined } from '@mui/icons-material';
import { useDeleteProjectMutation } from 'state/api';
import { renderNetworkChip, renderStatusChip } from 'utils/project';
import FlexBetween from 'components/FlexBetween';
import Update from './Update';
import Invite from './Invite';

const Header = ({ project }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [deleteProject] = useDeleteProjectMutation();
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [openInviteDialog, setOpenInviteDialog] = useState(false);

  const handleUpdateProject = () => {
    setOpenUpdateDialog(true);
  };

  const handleCloseUpdateDialog = () => {
    setOpenUpdateDialog(false);
  };

  const handleInviteNetwork = () => {
    setOpenInviteDialog(true);
  };

  const handleCloseInviteDialog = () => {
    setOpenInviteDialog(false);
  };

  const handleEdit = () => {
    
  };

  const handleDownloadPDF = () => {
    
  };

  useEffect(() => {
    console.log(project);
  }, [project]);

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
    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
      <FlexBetween sx={{ gap: '1rem' }}>
        <Typography variant="h5" fontWeight={550}>{project.title}</Typography>
        {project.status === 'Action Required' ?
          renderStatusChip(project.status, handleUpdateProject) :
          renderStatusChip(project.status)}
        {renderNetworkChip(project.contractors.length, handleInviteNetwork)}
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
      <Update
        open={openUpdateDialog}
        handleClose={handleCloseUpdateDialog}
      />
      <Invite
        open={openInviteDialog}
        handleClose={handleCloseInviteDialog}
      />
    </Box>
  );
};

export default Header;
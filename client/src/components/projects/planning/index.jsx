import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Paper, Typography, Button, Stack, useMediaQuery, Grid, IconButton, Divider, useTheme } from '@mui/material';
import { Add, MoreHorizOutlined, CreateOutlined, Circle, GroupOutlined } from '@mui/icons-material';
import FlexBetween from 'components/FlexBetween';
import UploadDocument from './UploadDocument';
<<<<<<< HEAD
import { useParseParcelsMutation } from 'state/api';
=======
>>>>>>> 5db4542fcca7ad039096ff9b8a3e8a803bfbeff1

const Planning = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { id } = useParams();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
  const [openUploadDocument, setOpenUploadDocument] = useState(false);

<<<<<<< HEAD
  const [parseParcels] = useParseParcelsMutation();

  const handleParseParcels = async () => {
    parseParcels().unwrap();
  };

=======
>>>>>>> 5db4542fcca7ad039096ff9b8a3e8a803bfbeff1
  const handleUploadDocument = () => {
    setOpenUploadDocument(true);
  };

  const handleUploadDocumentClose = () => {
    setOpenUploadDocument(false);
  };

  return (  
    <Box sx={{ mb: '2.5rem' }}>
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        sx={{
          gap: '1.5rem',
          "& > div": { 
            gridColumn: isNonMediumScreens ? undefined : "span 12",
          },
        }}
      >
        <Paper
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gridColumn: 'span 12',
            transition: 'box-shadow 0.3s',
            boxShadow: 'none',
            borderColor: 'grey.300',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderRadius: '16px',
            padding: '1.5rem 2rem',
            gap: '1rem',
            '&:hover': {
              boxShadow: theme => theme.shadows[3],
            },
          }}
        >
          <FlexBetween>
            {/* Title "Tasks" */}
            <Typography variant='h5' fontWeight={550}>
              Documents
            </Typography>
            <Button
              startIcon={<Add />}
              color='info'
              sx={{ fontWeight: 600 }}
              onClick={handleUploadDocument}
            >
              Upload Document
            </Button>
          </FlexBetween>

        </Paper>
        <UploadDocument open={openUploadDocument} onClose={handleUploadDocumentClose} />
      </Box>
    </Box>
  );
}

export default Planning;

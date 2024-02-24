import React, { useState } from 'react';
import { Box, Typography, TextField, Button, useMediaQuery, useTheme, Backdrop, CircularProgress, Slide } from '@mui/material';
import { Check, CheckCircleOutlined } from '@mui/icons-material';
import { UploaderComponent } from '@syncfusion/ej2-react-inputs';
import './create.css';
import { useUploadFileMutation } from 'state/api';
import { useNavigate } from 'react-router-dom';
import FlexBetween from 'components/FlexBetween';
import Dendrogram from './dendrogram';

const Create = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
  const [projectTitle, setProjectTitle] = useState('');
  const [projectSummary, setProjectSummary] = useState('');
  const [files, setFiles] = useState([]);
  const [uploadFile, { isLoading, data }] = useUploadFileMutation();
  const [formSubmitted, setFormSubmitted] = useState(false);

  const path = {
    removeUrl: 'https://ej2.syncfusion.com/services/api/uploadbox/Remove',
    saveUrl: 'https://ej2.syncfusion.com/services/api/uploadbox/Save'
  };

  const handleProjectTitleChange = (e) => {
    setProjectTitle(e.target.value);
  };

  const handleProjectSummaryChange = (e) => {
    setProjectSummary(e.target.value);
  };

  const handleFileChange = args => {
    // Get the file from the selected event
    const selectedFile = args.filesData[0].rawFile;
    setFiles([selectedFile]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Title:', projectTitle);
    console.log('Summary:', projectSummary);
    console.log('Files:', files);

    if (files.length > 0) {
      const formData = new FormData();
      formData.append('title', projectTitle);
      formData.append('summary', projectSummary);
      formData.append('file', files[0]);
      formData.append('status', 1);

      try {
        const response = await uploadFile(formData).unwrap();
        console.log('Successful file upload!', response);
        setFormSubmitted(true);
      } catch (err) {
        console.error('Error uploading PDF:', err);
      }
    }
  };

  const handleSaveDraft = () => {
    // Handle save draft action
  };

  const handleCancel = () => {
    navigate('/projects');
  };

  return (
    <Box m="1.5rem 2.5rem" sx={{ minHeight: 'calc(100vh - 3rem)' }}>
      <Backdrop open={isLoading} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Box
        mt="20px"
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gap="20px"
        sx={{
          "& > div": { gridColumn: isNonMediumScreens ? undefined : "span 12" },
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          gridColumn="span 6"
          sx={{ p: '2rem', border: '1px', borderRadius: '12px', boxShadow: theme.shadows[3] }}
        >
          <Typography variant="h3" fontWeight={550} sx={{ mb: '0.5rem' }}>Create Project</Typography>
          <Typography variant="h5" sx={{ mb: '2rem' }}>Deploy your new project in one-click</Typography>

          <Typography variant="h5" fontWeight={550}>1. Project Title</Typography>
          <TextField
            required
            fullWidth
            id="projectTitle"
            label="Enter project title"
            value={projectTitle}
            onChange={handleProjectTitleChange}
            margin="normal"
          />
          <Typography variant="h5" fontWeight={550} sx={{ mt: '1rem' }}>2. Project Summary</Typography>
          <TextField
            required
            fullWidth
            id="projectSummary"
            label="Enter project summary"
            value={projectSummary}
            onChange={handleProjectSummaryChange}
            margin="normal"
          />
          <Typography variant="h5" fontWeight={550} sx={{ mt: '1rem', mb: '1rem' }}>3. Upload a copy of the signed contract with your company and either the General Contractor or Property Owner.</Typography>
          <Box sx={{ mb: '2rem' }}>
            <UploaderComponent asyncSettings={path} multiple={false} selected={handleFileChange} />
          </Box>

          {formSubmitted ? (
            <Typography variant="h5" sx={{ color: 'green', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px' }}>
              <CheckCircleOutlined color="success" />Project created successfully
            </Typography>
          ) : (
            <FlexBetween>
              <Button
                variant="contained"
                color="info"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="success"
              >
                Submit
              </Button>
            </FlexBetween>
          )}
        </Box>

        {formSubmitted && (
          <Slide direction="left" in={formSubmitted} mountOnEnter unmountOnExit>
            <Box
              gridColumn='span 6'
              sx={{ p: '2rem', border: '1px', borderRadius: '12px', boxShadow: theme.shadows[3] }}
            >
              <Typography>Upload Successful!</Typography>
              <Dendrogram width={400} height={400} />
            </Box>
          </Slide>
        )}
      </Box>
    </Box>
  );
}

export default Create;

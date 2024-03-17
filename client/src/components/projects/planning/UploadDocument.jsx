import React, { useState } from 'react';
import {
  Dialog, 
  DialogContent, 
  Button, 
  TextField,
  Box,
  Typography,
} from "@mui/material";
import { useUploadDocumentMutation } from 'state/api';
import { useParams } from 'react-router-dom';
import { UploaderComponent } from '@syncfusion/ej2-react-inputs';
import FlexBetween from 'components/FlexBetween';


const UploadDocument = ({ open, onClose }) => {
  const { id } = useParams();
  const [documentTitle, setDocumentTitle] = useState('');
  const [documentSummary, setDocumentSummary] = useState('');
  const [files, setFiles] = useState([]);

  const [uploadDocument] = useUploadDocumentMutation();

  const path = {
    removeUrl: 'https://ej2.syncfusion.com/services/api/uploadbox/Remove',
    saveUrl: 'https://ej2.syncfusion.com/services/api/uploadbox/Save'
  };

  const handleDocumentTitleChange = (e) => {
    setDocumentTitle(e.target.value);
  };

  const handleDocumentSummaryChange = (e) => {
    setDocumentSummary(e.target.value);
  };

  const handleDocumentChange = args => {
    const selectedFile = args.filesData[0].rawFile;
    setFiles([selectedFile]);
  };

  const handleSubmit = async () => {
    if (files.length > 0) {
      const formData = new FormData();
      formData.append('projectId', id);
      formData.append('title', documentTitle);
      formData.append('summary', documentSummary);
      formData.append('file', files[0]);

      try {
        const response = await uploadDocument(formData).unwrap();
        console.log('Successful file upload!', response);
      } catch (err) {
        console.error('Error uploading PDF:', err);
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogContent>
        <Box
          component='form'
          onSubmit={handleSubmit}
          noValidate
          autoComplete='off'
          fullWidth
          sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}
        >
          <Typography variant='h5' fontWeight={550}>1. Document Title</Typography>
          <TextField
            required
            fullWidth
            id='documentTitle'
            label='Enter document title'
            value={documentTitle}
            onChange={handleDocumentTitleChange}
            margin='normal'
            size='small'
          />
          <Typography variant='h5' fontWeight={550} sx={{ mt: '1rem' }}>2. Document Summary</Typography>
          <TextField
            required
            fullWidth
            id='documentSummary'
            label='Enter document summary'
            value={documentSummary}
            onChange={handleDocumentSummaryChange}
            margin='normal'
            size='small'
          />
          <Typography variant='h5' fontWeight={550} sx={{ mt: '1rem', mb: '1rem' }}>3. Upload your document.</Typography>
          <Box sx={{ mb: '2rem' }}>
            <UploaderComponent asyncSettings={path} multiple={false} selected={handleDocumentChange} />
          </Box>

          <FlexBetween>
            <Button
              variant='contained'
              color='info'
            >
              Cancel
            </Button>
            <Button
              type='submit'
              variant='contained'
              color='success'
            >
              Submit
            </Button>
          </FlexBetween>
        </Box>
      </DialogContent>        
    </Dialog>
  );
};

export default UploadDocument;

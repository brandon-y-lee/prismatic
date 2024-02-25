import React, { useState } from 'react';
import { Box, Typography, TextField, Button, useMediaQuery, useTheme, Backdrop, CircularProgress, Slide } from '@mui/material';
import { Check, CheckCircleOutlined } from '@mui/icons-material';
import { UploaderComponent } from '@syncfusion/ej2-react-inputs';
import { useUploadFileMutation, useCreateProjectMutation } from 'state/api';
import { useNavigate } from 'react-router-dom';
import FlexBetween from 'components/FlexBetween';
import Dendrogram from 'components/projects/dendrogram';
import { getLoggedInUser } from 'utils/token';

const Budget = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
  const user = getLoggedInUser();
  console.log('User: ', user);

  const [projectTitle, setProjectTitle] = useState('');
  const [projectSummary, setProjectSummary] = useState('');
  const [files, setFiles] = useState([]);
  const [uploadFile] = useUploadFileMutation();
  const [createProject, { isLoading, data }] = useCreateProjectMutation();
  const [formSubmitted, setFormSubmitted] = useState(false);

  return (  
    <Box m="1.5rem 2.5rem" sx={{ minHeight: 'calc(100vh - 3rem)' }}>
      <Box
        mt="20px"
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        sx={{
          "& > div": { gridColumn: isNonMediumScreens ? undefined : "span 12" },
        }}
      >
        <Box
          gridColumn="span 4"
          sx={{ p: '2rem', border: '1px', borderRadius: '12px', boxShadow: theme.shadows[3] }}
        >
        
        </Box>

        <Box
          gridColumn="span 4"
          sx={{ p: '2rem', border: '1px', borderRadius: '12px', boxShadow: theme.shadows[3] }}
        >
          
        </Box>

        <Box
          gridColumn="span 4"
          sx={{ p: '2rem', border: '1px', borderRadius: '12px', boxShadow: theme.shadows[3] }}
        >
          
        </Box>
      </Box>
    </Box>
  );
}

export default Budget;

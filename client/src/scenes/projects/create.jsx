import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, useMediaQuery, Backdrop, CircularProgress, Slide, Paper } from '@mui/material';
import { UploaderComponent } from '@syncfusion/ej2-react-inputs';
import { useCreateProjectMutation, useScrapeZimasMutation, useUpdateProjectMutation } from 'state/api';
import { getLoggedInUser } from 'utils/token';
import { transformData } from 'utils/project';
import FlexBetween from 'components/FlexBetween';
import './create.css';


const Create = () => {
  const user = getLoggedInUser();
  const isNonMediumScreens = useMediaQuery('(min-width: 1200px)');
  const navigate = useNavigate();

  const [projectId, setProjectId] = useState(null);
  const [projectTitle, setProjectTitle] = useState('');
  const [projectSummary, setProjectSummary] = useState('');
  const [houseNumber, setHouseNumber] = useState('');
  const [streetName, setStreetName] = useState('');

  const [files, setFiles] = useState([]);

  const [createProject, { isLoading: isProjectLoading, data: projectData }] = useCreateProjectMutation();
  const [formSubmitted, setFormSubmitted] = useState(false);

  const [scrapeZimas, { isLoading: isScraping, data: zimasData }] = useScrapeZimasMutation();
  const [updateProject, { isLoading: isProjectUpdaing, data: updatedProjectData }] = useUpdateProjectMutation();

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

  const handleHouseNumberChange = (e) => {
    setHouseNumber(e.target.value);
  };

  const handleStreetNameChange = (e) => {
    setStreetName(e.target.value);
  };

  const handleFileChange = args => {
    const selectedFile = args.filesData[0].rawFile;
    setFiles([selectedFile]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let userId = user.userId;

    try {
      const response = await createProject({ 
        owner: userId,
        title: projectTitle,
        summary: projectSummary
      }).unwrap();

      console.log('Project created successfully!', response);
      setFormSubmitted(true);
      setProjectId(response._id);
    } catch (err) {
      console.error('Error uploading PDF:', err);
    }
  };

  const handleScrape = async () => {
    if (!projectId) {
      console.error('No project ID available for updating.');
      return;
    }

    try {
      const results = await scrapeZimas({
        houseNumber: houseNumber,
        streetName: streetName
      }).unwrap();

      await handleUpdateProject(projectId, results);
      console.log('Data retrieved and project updated successfully.');
    } catch (error) {
      console.error('Error retrieving data or updating project: ', error);
    }
  };

  const handleUpdateProject = async (projectId, results) => {
    const transformedData = transformData(results);

    try {
      const updateResponse = await updateProject({
        projectId: projectId,
        data: transformedData,
      }).unwrap();

      console.log('Project updated successfully: ', updateResponse);
      navigate('/projects');
    } catch (error) {
      console.error('Error updating project: ', error);
    }
  };

  const handleSaveDraft = () => {
    // Handle save draft action
  };

  const handleCancel = () => {
    navigate('/projects');
  };

  return (
    <Box sx={{ m: '1.5rem 2.5rem' }}>
      <Backdrop open={isProjectLoading} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <CircularProgress color='info' />
      </Backdrop>
      <Box
        mt='20px'
        display='grid'
        gridTemplateColumns='repeat(12, 1fr)'
        gap='20px'
        sx={{
          '& > div': { gridColumn: isNonMediumScreens ? undefined : 'span 12' },
        }}
      >
        <Paper
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gridColumn: 'span 6',
            transition: 'box-shadow 0.3s',
            boxShadow: 'none',
            borderColor: 'grey.300',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderRadius: '16px',
            padding: '2rem',
            '&:hover': {
              boxShadow: theme => theme.shadows[3],
            },
          }}
        >
          <Typography variant='h3' fontWeight={550} sx={{ mb: '0.5rem' }}>Create Project</Typography>
          <Typography variant='h5' sx={{ mb: '2rem' }}>Deploy your new project in one-click</Typography>
          <Box
            component='form'
            onSubmit={handleSubmit}
            noValidate
            autoComplete='off'
            fullWidth
            sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}
          >
            <Typography variant='h5' fontWeight={550}>1. Project Title</Typography>
            <TextField
              required
              fullWidth
              id='projectTitle'
              label='Enter project title'
              placeholder='Ex: Van Nuys Apartment Development'
              value={projectTitle}
              onChange={handleProjectTitleChange}
              margin='normal'
            />
            <Typography variant='h5' fontWeight={550} sx={{ mt: '1rem' }}>2. Project Summary</Typography>
            <TextField
              required
              fullWidth
              id='projectSummary'
              label='Enter project summary'
              placeholder='Ex: 60 one/two-bedroom units'
              value={projectSummary}
              onChange={handleProjectSummaryChange}
              margin='normal'
            />
            <Typography variant='h5' fontWeight={550} sx={{ mt: '1rem', mb: '1rem' }}>3. Upload a copy of the signed contract with your company and either the General Contractor or Property Owner.</Typography>
            <Box sx={{ mb: '2rem' }}>
              <UploaderComponent asyncSettings={path} multiple={false} selected={handleFileChange} />
            </Box>

            {formSubmitted ? (
              <FlexBetween>
                <Box sx={{ flexGrow: 1 }} />
                <Button
                  type='submit'
                  variant='contained'
                  color='success'
                  disabled
                >
                  Draft Created
                </Button>
              </FlexBetween>
            ) : (
              <FlexBetween>
                <Button
                  variant='contained'
                  color='info'
                  onClick={handleCancel}
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
            )}
          </Box>
        </Paper>

        {formSubmitted && (
          <Slide direction='left' in={formSubmitted} mountOnEnter unmountOnExit>
            <Paper
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gridColumn: 'span 6',
                transition: 'box-shadow 0.3s',
                boxShadow: 'none',
                borderColor: 'grey.300',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderRadius: '16px',
                padding: '2rem',
                mb: isNonMediumScreens ? undefined : '2rem',
                '&:hover': {
                  boxShadow: theme => theme.shadows[3],
                },
              }}
            >
              <Typography variant='h3' fontWeight={550} sx={{ mb: '0.5rem' }}>Next Steps</Typography>
              <Typography variant='h5' sx={{ mb: '2rem' }}>Configure your project by location</Typography>
              <Box
                component='form'
                noValidate
                autoComplete='off'
                fullWidth
                sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', gap: '2rem' }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', width: 'calc(50% - 8px)' }}>
                    <Typography variant='h5' fontWeight={550}>House Number</Typography>
                    <TextField
                      required
                      fullWidth
                      id='houseNumber'
                      label='Enter house number'
                      placeholder='Ex: 14400'
                      value={houseNumber}
                      onChange={handleHouseNumberChange}
                      margin='normal'
                    />
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', width: 'calc(50% - 8px)' }}>
                    <Typography variant='h5' fontWeight={550}>Street Name</Typography>
                    <TextField
                      required
                      fullWidth
                      id='streetName'
                      label='Enter street name'
                      placeholder='Van Nuys'
                      value={streetName}
                      onChange={handleStreetNameChange}
                      margin='normal'
                    />
                  </Box>
                </Box>
                
                <FlexBetween>
                  <Button
                    variant='contained'
                    color='info'
                    onClick={handleCancel}
                    disabled={isScraping}
                  >
                    Cancel
                  </Button>
                  <Button
                    type='submit'
                    variant='contained'
                    color='success'
                    onClick={handleScrape}
                    disabled={isScraping}
                  >
                    {isScraping ? 'Configuring...' : 'Submit'}
                  </Button>
                </FlexBetween>
              </Box>
            </Paper>
          </Slide>
        )}
      </Box>
    </Box>
  );
}

export default Create;

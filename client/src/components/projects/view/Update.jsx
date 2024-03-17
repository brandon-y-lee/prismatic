import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Dialog, DialogTitle, DialogContent, TextField, Button, DialogActions } from '@mui/material';
import { transformData } from 'utils/project';
import { useScrapeZimasMutation, useUpdateProjectMutation } from 'state/api';

const Update = ({ open, handleClose }) => {
  const { id: projectId } = useParams();
  const [houseNumber, setHouseNumber] = useState('');
  const [streetName, setStreetName] = useState('');
  const navigate = useNavigate();

  const [scrapeZimas, { isLoading: isScraping, data: zimasData }] = useScrapeZimasMutation();
  const [updateProject, { isLoading: isProjectUpdaing, data: updatedProjectData }] = useUpdateProjectMutation();

  const handleHouseNumberChange = (event) => {
    setHouseNumber(event.target.value);
  };

  const handleStreetNameChange = (event) => {
    setStreetName(event.target.value);
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
      handleClose();
    } catch (error) {
      console.error('Error updating project: ', error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth='sm'>
      <DialogContent>
        <Typography variant='h4' fontWeight={550}>Next Steps</Typography>
        <Typography variant='h5' sx={{ mt: '0.5rem', mb: '1.5rem' }}>Configure your project by location</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Typography variant='h5' fontWeight={550}>House Number</Typography>
            <TextField
              required
              fullWidth
              id='houseNumber'
              label='Enter house number'
              placeholder='Ex: 14400'
              value={houseNumber}
              onChange={handleHouseNumberChange}
              size='small'
            />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Typography variant='h5' fontWeight={550}>Street Name</Typography>
            <TextField
              required
              fullWidth
              id='streetName'
              label='Enter street name'
              placeholder='Van Nuys'
              value={streetName}
              onChange={handleStreetNameChange}
              size='small'
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: '1rem', p: '1rem' }}>
          <Button
            variant='contained'
            onClick={handleClose}
            disabled={isScraping}
          >
            Cancel
          </Button>
          <Button
            variant='contained'
            color='success'
            onClick={handleScrape}
            disabled={isScraping}
          >
            {isScraping ? 'Configuring...' : 'Submit'}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default Update;

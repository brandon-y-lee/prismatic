import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Dialog, DialogContent, DialogActions, TextField, Button, Autocomplete, Chip } from '@mui/material';
import { useGetContractorsQuery } from 'state/api';
const Invite = ({ open, handleClose }) => {
  const { id: projectId } = useParams();
  const [recipients, setRecipients] = useState([]);
  const { data: contractors, isLoading: isContractorsLoading } = useGetContractorsQuery(undefined, { skip: !open });

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth='sm'>
      <DialogContent>
        <Typography variant='h4' fontWeight={550}>Next Steps</Typography>
        <Typography variant='h5' sx={{ mt: '0.5rem', mb: '1.5rem' }}>Invite collaborators for this project</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Typography variant="subtitle2" display="block" gutterBottom>
            To
          </Typography>
          <Autocomplete
            multiple
            autoHighlight
            freeSolo
            variant='standard'
            id="recipients"
            options={contractors || []}
            getOptionLabel={(option) => option ? option.name : ''}
            filterSelectedOptions
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip variant="outlined" label={option.name} {...getTagProps({ index })} />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                variant='outlined'
                placeholder='Type the name of an email, person, or team'
              />
            )}
            // value={recipients.map(id => contractors.find(member => member._id === id)).filter(Boolean)}
            onChange={(event, newValue) => {
              setRecipients(newValue.map(item => item._id));
            }}
            sx={{ width: '100%', backgroundColor: 'transparent' }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: '1rem', p: '1rem' }}>
          <Button
            variant='contained'
            color='info'
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            variant='contained'
            color='success'
          >
            Submit
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default Invite;

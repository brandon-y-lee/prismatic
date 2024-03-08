import React, { useState, useEffect } from 'react';
import {
  Dialog, 
  DialogContent, 
  DialogActions,
  Button, 
  Box, 
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Autocomplete,
  TextField,
  Chip,
} from "@mui/material";
import { Close } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { getLoggedInUser } from 'utils/token';
import { useCreateMessageMutation } from 'state/api';

const CreateNewMessage = ({ open, onClose, crewName, crewMembers }) => {
  const [subject, setSubject] = useState('');
  const [recipients, setRecipients] = useState([]);
  const [message, setMessage] = useState('');
  const { id, crewId } = useParams();
  const user = getLoggedInUser();

  const [createMessage] = useCreateMessageMutation();

  useEffect(() => {
    console.log('recipients on change: ', recipients);
  }, [recipients]);
  
  const handleSubjectChange = (event) => {
    setSubject(event.target.value);
  };

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSubmit = async () => {
    const messageData = {
      projectId: id,
      crewId: crewId,
      senderId: user.userId,
      recipients: recipients,
      subject: subject,
      content: message
    };

    try {
      await createMessage(messageData).unwrap();
    } catch (error) {
      console.error('Failed to create message: ', error);
    } finally {
      onClose();
    }
  };

  return (
    <Dialog fullScreen open={open} onClose={onClose}>
      <AppBar elevation={0} sx={{ position: 'relative', boxShadow: 'none' }}>
        <Toolbar>
          <Typography variant='h6' sx={{ flex: 1 }}>New message</Typography>
          <IconButton color='inherit' onClick={onClose} aria-label='close'>
            <Close />
          </IconButton>
        </Toolbar>
      </AppBar>
      <DialogContent sx={{ p: 0, mt: '4rem', mx: '20rem' }}>
        <TextField
          autoFocus
          hiddenLabel
          fullWidth
          variant="standard"
          placeholder="Add Subject"
          InputProps={{
            disableUnderline: true,
            style: { fontSize: '1.5rem', backgroundColor: 'transparent' }
          }}
          value={subject}
          onChange={handleSubjectChange}
        />
        <Box sx={{ my: 2 }}>
          <Typography variant="subtitle2" display="block" gutterBottom>
            To
          </Typography>
          <Autocomplete
            multiple
            autoHighlight
            variant='standard'
            id="recipients"
            options={crewMembers || []}
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
                variant="outlined"
                placeholder="Type the name of a team, a project, or people"
              />
            )}
            value={recipients.map(id => crewMembers.find(member => member._id === id)).filter(Boolean)}
            onChange={(event, newValue) => {
              setRecipients(newValue.map(item => item._id));
            }}
            sx={{ width: '100%', backgroundColor: 'transparent' }}
          />
        </Box>
        <TextField
          id="message-body"
          label="Type / for menu"
          multiline
          rows={4}
          fullWidth
          variant="outlined"
          value={message}
          onChange={handleMessageChange}
        />
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'space-between', mx: '20rem', my: '2rem' }}>
        <Typography variant="body2">
          {recipients.length} people will be notified
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
          <Button variant='outlined' color='info' onClick={onClose}>Discard</Button>
          <Button variant='contained' color='info' onClick={handleSubmit}>
            Send
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default CreateNewMessage;

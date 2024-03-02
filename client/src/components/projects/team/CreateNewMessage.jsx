import React, { useState } from 'react';
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
  Stack,
  Chip,
} from "@mui/material";
import { Close, PersonAddAlt1Outlined } from '@mui/icons-material';

const CreateNewMessage = ({ open, onClose, isMinimized, teamMembers }) => {
  const [subject, setSubject] = useState('');
  const [recipients, setRecipients] = useState([]);
  const [message, setMessage] = useState('');

  const handleSubjectChange = (event) => {
    setSubject(event.target.value);
  };

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleAddRecipient = () => {

  };

  const handleSubmit = () => {
    console.log({ subject, recipients, message });
    onClose();
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
            variant='standard'
            multiple
            id="recipients"
            options={teamMembers.map((option) => option.name)}
            filterSelectedOptions
            freeSolo
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip variant="outlined" label={option} {...getTagProps({ index })} />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                placeholder="Type the name of a team, a project, or people"
              />
            )}
            value={recipients}
            onChange={(event, newValue) => {
              setRecipients(newValue);
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

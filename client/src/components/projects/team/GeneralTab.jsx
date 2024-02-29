import React, { useState } from 'react';
import {
  TextField, 
  Box,
  Typography
} from "@mui/material";
import { MoreVertOutlined } from '@mui/icons-material';

const GeneralTab = () => {
  const [teamName, setTeamName] = useState('');
  const [description, setDescription] = useState('');

  const handleTeamNameChange = (event) => {
    setTeamName(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', my: 2, mx: 1 }}>
        <Typography variant='h6'>Project</Typography>
        <Typography variant='h6' sx={{ fontWeight: 550 }}>Test</Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', my: 3, mx: 1 }}>
        <Typography variant='body1'>Team name</Typography>
        <TextField
          variant="outlined"
          size="small"
          margin="dense"
          id="team"
          fullWidth
          value={teamName}
          onChange={handleTeamNameChange}
        />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', my: 2, mx: 1 }}>
        <Typography variant='body1'>Description</Typography>
        <TextField
          variant="outlined"
          size="small"
          margin="dense"
          id="team"
          rows={4}
          multiline
          fullWidth
          value={description}
          onChange={handleDescriptionChange}
        />
      </Box>
    </Box>
  );
};

export default GeneralTab;


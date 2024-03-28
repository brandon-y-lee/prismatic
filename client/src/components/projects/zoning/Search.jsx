import React, { useState } from 'react';
import { Box, TextField, IconButton, InputAdornment } from "@mui/material";
import { SearchOutlined } from '@mui/icons-material';

const Search = ({ onSearch }) => {
  const [parcelNumber, setParcelNumber] = useState('');

  const handleParcelNumberChange = (e) => {
    setParcelNumber(e.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    onSearch(parcelNumber);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '1rem' }}
    >
      <TextField
        fullWidth
        id='parcelNumber'
        placeholder='Search by parcel number'
        value={parcelNumber}
        onChange={handleParcelNumberChange}
        size='small'
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={handleSubmit}
                edge="end"
              >
                <SearchOutlined />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};

export default Search;

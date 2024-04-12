import React, { useState } from 'react';
import { Box, TextField, IconButton, InputAdornment } from "@mui/material";
import { SearchOutlined } from '@mui/icons-material';

const Search = ({ onSearch }) => {
  const [contractorLicense, setContractorLicense] = useState('');

  const handleContractorLicenseChange = (e) => {
    setContractorLicense(e.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    onSearch(contractorLicense);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '1rem' }}
    >
      <TextField
        fullWidth
        id='contractorLicense'
        placeholder='Search by contractor license'
        value={contractorLicense}
        onChange={handleContractorLicenseChange}
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

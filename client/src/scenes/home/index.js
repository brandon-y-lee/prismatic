import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, InputBase, Paper, IconButton, Typography, useTheme } from '@mui/material';
import { Search } from '@mui/icons-material';
import { useInteractWithAssistantMutation } from 'state/api';
import FlexBetween from 'components/FlexBetween';
import logo from "assets/logo.png";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const theme = useTheme();

  const handleSearch = async (event) => {
    event.preventDefault();
    if (!searchQuery.trim()) return;

    navigate('/search/loading', { state: { searchQuery } });
  };

  const setSuggestion = async (suggestion) => {
    setSearchQuery(suggestion);
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="75vh"
      >
        <Box display="flex" justifyContent="center" alignItems="center" mb="2rem">
          <img src={logo} alt="Aleth Logo" height="100px" />
        </Box>

        <FlexBetween
          component="form"
          onSubmit={handleSearch}
          backgroundColor={theme.palette.background.alt}
          borderRadius="9px"
          gap="3rem"
          p="0.25rem 1rem"
          width='100%'
          maxWidth='600px'
        >
          <InputBase 
            sx={{ ml: 1, flex: 1}}
            placeholder="Search for Your Construction Needs"
            inputProps={{ 'aria-label': 'search' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <IconButton type="submit">
            <Search />
          </IconButton>
        </FlexBetween>

        <Box mt={3} display="flex" justifyContent="center" flexWrap="wrap" gap={2}>
          {/* Replace with actual suggestions fetched from an API or predefined */}
          {['Find local suppliers of high-grade concrete', 'Rent a crane for high-rise construction', 'Hire certified electricians for commercial project'].map((suggestion, index) => (
            <Box
              key={index}
              sx={{
                bgcolor: theme.palette.background.paper,
                borderRadius: '20px',
                px: 3,
                py: 1,
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: theme.palette.action.hover,
                },
              }}
              onClick={() => setSuggestion(suggestion)}
            >
              <Typography variant="subtitle1" color="textSecondary">
                {suggestion}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
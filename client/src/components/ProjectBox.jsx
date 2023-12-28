import React from "react";
import { useNavigate } from 'react-router-dom';
import { Box, Typography, useTheme } from "@mui/material";

const ProjectBox = ({ title, value, page }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box
      gridColumn="span 3"
      gridRow="span 1"
      display="flex"
      flexDirection="column"
      gap="1.15rem"
      p="1.5rem 1rem"
      flex="1 1 100%"
      backgroundColor={theme.palette.background.alt}
      borderRadius="0.55rem"
      onClick={() => navigate(`/${page}`)}
    >
      <Typography
        variant="h1"
        fontWeight="600"
        sx={{ color: '#1677FF', textAlign: 'center' }}
      >
        10
      </Typography>
      <Typography variant="h4" sx={{ color: '#1677FF', fontWeight: 500, textAlign: 'center' }}>
        {title}
      </Typography>
    </Box>
  );
};

export default ProjectBox;

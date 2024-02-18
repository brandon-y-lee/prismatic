import React, { useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";

const ProjectBox = ({ title, value, onSelect }) => {
  const theme = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    onSelect(title);
  };

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
      borderRadius="8px"
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        transition: 'box-shadow 0.3s',
        boxShadow: 'none',
        '&:hover': {
          boxShadow: theme => theme.shadows[3],
          backgroundColor: '#1677FF',
        },
      }}
    >
      <Typography
        variant="h1"
        fontWeight="600"
        sx={{ 
          color: isHovered ? 'white' : '#1677FF', 
          textAlign: 'center' 
        }}
      >
        10
      </Typography>
      <Typography
        variant="h4"
        sx={{
          color: isHovered ? 'white' : '#1677FF', 
          fontWeight: 500, 
          textAlign: 'center' 
        }}
      >
        {title}
      </Typography>
    </Box>
  );
};

export default ProjectBox;

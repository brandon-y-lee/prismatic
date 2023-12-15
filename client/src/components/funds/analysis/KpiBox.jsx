import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import FlexBetween from "components/FlexBetween";

const KpiBox = ({ title, value, increase, icon }) => {
  const theme = useTheme();

  return (
    <Box
      gridColumn="span 3"
      gridRow="span 1"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      p="1.15rem 1rem 1.25rem 1rem"
      flex="1 1 100%"
      backgroundColor={theme.palette.background.alt}
      borderRadius="0.55rem"
    >
      <FlexBetween>
        <Typography variant="h6">
          {title}
        </Typography>
        <Typography variant="h6" fontStyle="italic" sx={{ color: theme.palette.secondary.light }}>
          {increase}
        </Typography>
      </FlexBetween>

      <FlexBetween>
        {icon}
        <Typography variant="h3" sx={{ fontWeight: '500' }}>
          ${value}
        </Typography>
      </FlexBetween>
    </Box>
  );
};

export default KpiBox;

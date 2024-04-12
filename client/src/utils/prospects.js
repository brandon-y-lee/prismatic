import React from 'react';
import FlexBetween from "components/FlexBetween";
import { Chip, Slider } from "@mui/material";

export const renderBoundsChip = (lowerBound, higherBound) => {
  return (
    <FlexBetween>
      <Chip
        label={lowerBound}
        size='small'
        sx={{ backgroundColor: 'grey', color: 'white' }}
      />
      <Chip
        label={higherBound}
        size='small'
        sx={{ backgroundColor: 'grey', color: 'white' }}
      />
    </FlexBetween>
  );
};

export const styledSlider = ({ value, onChange, ...props }) => {
  return (
    <Slider
      value={value}
      onChange={onChange}
      valueLabelDisplay='auto'
      size='small'
      color='info'
      sx={{
        '& .MuiSlider-thumb': {
          height: 12,
          width: 12,
          backgroundColor: '#fff',
          border: '2px solid currentColor',
          '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
            boxShadow: 'inherit',
          },
          '&::before': {
            display: 'none',
          },
        },
      }}
      {...props}
    />
  );
};
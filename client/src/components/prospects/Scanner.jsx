import React, { useState } from 'react';
import { Box, TextField, IconButton, InputAdornment, Slider, Typography, Paper, Grid, Divider, List, ListItem, ListItemText, ListItemSecondaryAction, Checkbox } from '@mui/material';
import { SearchOutlined } from '@mui/icons-material';
import FlexBetween from 'components/FlexBetween';
import { renderBoundsChip, styledSlider } from 'utils/prospects';

const Scanner = ({ onSearch }) => {
  const [parcelNumber, setParcelNumber] = useState('');

  const [lotSize, setLotSize] = useState([0, 20]);
  const [buildableArea, setBuildableArea] = useState([0, 20]);
  const [unitsAllowed, setUnitsAllowed] = useState([0, 20]);

  const [lotSizeCheckbox, setLotSizeCheckbox] = useState(false);
  const [buildableAreaCheckbox, setBuildableAreaCheckbox] = useState(false);
  const [unitsAllowedCheckbox, setUnitsAllowedCheckbox] = useState(false);

  const handleParcelNumberChange = (e) => {
    setParcelNumber(e.target.value);
  };

  const handleLotSizeChange = (event, newValue) => {
    setLotSize(newValue);
  };

  const handleLotSizeCheckboxChange = (event) => {
    setLotSizeCheckbox(event.target.checked);
  };

  const handleBuildableAreaChange = (event, newValue) => {
    setBuildableArea(newValue);
  };

  const handleBuildableAreaCheckboxChange = (event) => {
    setBuildableAreaCheckbox(event.target.checked);
  };

  const handleUnitsAllowedChange = (event, newValue) => {
    setUnitsAllowed(newValue);
  };

  const handleUnitsAllowedCheckboxChange = (event) => {
    setUnitsAllowedCheckbox(event.target.checked);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    onSearch(parcelNumber);
  };

  return (
    <Paper
      sx={{
        transition: 'box-shadow 0.3s',
        boxShadow: 'none',
        borderColor: 'grey.300',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderRadius: '16px',
        '&:hover': {
          boxShadow: theme => theme.shadows[2],
        },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '1rem', height: '65vh' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', px: '1.5rem', pt: '1.5rem' }}>
          <Typography variant='h5' sx={{ fontWeight: '525' }}>SEARCH CRITERIA</Typography>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Typography>Uses Allowed</Typography>
              <Typography>Zoning Districts</Typography>
              <Typography>Lot Size</Typography>
              <Typography>Buildable Area</Typography>
              <Typography>Units Allowed</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>Building Height</Typography>
              <Typography>Existing Building Area</Typography>
              <Typography>Year Built</Typography>
              <Typography>Median Income</Typography>
              <Typography>Median Gross</Typography>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ overflowY: 'auto', px: '1rem', pb: '0.5rem' }}>
          <List sx={{ width: '100%' }}>
            <ListItem disablePadding sx={{ width: '100%' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, mx: 1 }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                  <Checkbox
                    edge='start'
                    color='info'
                    onChange={handleLotSizeCheckboxChange}
                    checked={lotSizeCheckbox}
                    sx={{ py: 0, my: 0 }}
                  />
                  <Typography variant='body2' sx={{ color: 'grey', alignItems: 'center', m: 0 }}>Lot Size (SF)</Typography>
                </Box>
                {styledSlider({
                  value: lotSize,
                  onChange: handleLotSizeChange
                })}
                {renderBoundsChip('5000', '120000')}
              </Box>
            </ListItem>
            <Divider sx={{ my: 2 }} />
            <ListItem disablePadding sx={{ width: '100%' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, mx: 1 }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                  <Checkbox
                    edge='start'
                    color='info'
                    onChange={handleBuildableAreaCheckboxChange}
                    checked={buildableAreaCheckbox}
                    sx={{ py: 0, my: 0 }}
                  />
                  <Typography variant='body2' sx={{ color: 'grey', alignItems: 'center', m: 0 }}>Approx. Buildable Area (SF)</Typography>
                </Box>
                {styledSlider({
                  value: buildableArea,
                  onChange: handleBuildableAreaChange
                })}
                {renderBoundsChip('50,000', '500,000')}
              </Box>
            </ListItem>
            <Divider sx={{ my: 2 }} />
            <ListItem disablePadding sx={{ width: '100%' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, mx: 1 }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                  <Checkbox
                    edge='start'
                    color='info'
                    onChange={handleUnitsAllowedCheckboxChange}
                    checked={unitsAllowedCheckbox}
                    sx={{ py: 0, my: 0 }}
                  />
                  <Typography variant='body2' sx={{ color: 'grey', alignItems: 'center', m: 0 }}>Estimated Units Allowed</Typography>
                </Box>
                {styledSlider({
                  value: unitsAllowed,
                  onChange: handleUnitsAllowedChange
                })}
                {renderBoundsChip('20', '400')}
              </Box>
            </ListItem>
            <Divider sx={{ my: 2 }} />
            <ListItem disablePadding sx={{ width: '100%' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, mx: 1 }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                  <Checkbox
                    edge='start'
                    color='info'
                    onChange={handleUnitsAllowedCheckboxChange}
                    checked={unitsAllowedCheckbox}
                    sx={{ py: 0, my: 0 }}
                  />
                  <Typography variant='body2' sx={{ color: 'grey', alignItems: 'center', m: 0 }}>Estimated Units Allowed</Typography>
                </Box>
                {styledSlider({
                  value: unitsAllowed,
                  onChange: handleUnitsAllowedChange
                })}
                {renderBoundsChip('20', '400')}
              </Box>
            </ListItem>
          </List>
        </Box>
      </Box>
    </Paper>
  );
};

export default Scanner;
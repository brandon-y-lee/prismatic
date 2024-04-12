import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography } from "@mui/material";
import { ExpandMore } from '@mui/icons-material';
import FlexBetween from 'components/FlexBetween';
import { formatNumber } from 'utils/parcels';

const BuildingAccordion = ({ building }) => (
  <Accordion disableGutters square elevation={0} sx={{ border: 'none', '&:before': { display: 'none' }, '.MuiAccordionSummary-root': { px: 0.75 }, '.MuiAccordionDetails-root': { px: 0.75 } }}>
    <AccordionSummary expandIcon={<ExpandMore />} aria-controls="building-content" id={`building-header-${building._id}`}>
      <Typography fontWeight={550}>{building.area_id}</Typography>
    </AccordionSummary>
    <AccordionDetails>
      <FlexBetween>
        <Typography>
          Area<br />
          Perimeter<br />
        </Typography>
        <Typography sx={{ textAlign: 'right' }}>
          {formatNumber(building.area)} (sq ft)<br />
          {formatNumber(building.perimeter)} (ft)<br />
        </Typography>
      </FlexBetween>
    </AccordionDetails>
  </Accordion>
);

export default BuildingAccordion;

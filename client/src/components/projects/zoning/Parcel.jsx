import React, { useState } from 'react';
import { Box, Accordion, AccordionSummary, AccordionDetails, Typography } from "@mui/material";
import { ExpandMore } from '@mui/icons-material';
import FlexBetween from 'components/FlexBetween';

const Parcel = ({ parcelData }) => {
  if (!parcelData) {
    return <Box />;
  };

  const parcel = parcelData[0];

  return (
    /* Enable overflow */
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', overflowY: 'auto' }}>
      <Typography variant='h5' fontWeight='550' sx={{ mb: '0.5rem' }}>Report: {parcel.mapblklot}</Typography>
      <Accordion disableGutters square>
        <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1-content" id="panel1-header">
          <Typography fontWeight={550}>Address/Legal</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FlexBetween>
            <Typography>
              Parcel:<br />
              Block/Lot:<br />
              Address(es):<br />
            </Typography>
            <Typography sx={{ textAlign: 'right' }}>
              {parcel.mapblklot}<br />
              {parcel.block_num}/{parcel.lot_num}<br />
              {parcel.from_address_num} {parcel.street_name} {parcel.street_type}<br />
            </Typography>
          </FlexBetween>
        </AccordionDetails>
      </Accordion>
      <Accordion disableGutters square>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <Typography fontWeight={550}>Jurisdictional</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FlexBetween>
            <Typography>
              Supervisor District:<br />
              Supervisor:<br />
              Neighborhood:<br />
            </Typography>
            <Typography sx={{ textAlign: 'right' }}>
              District {parcel.supervisor_district}<br />
              {parcel.supname}<br />
              {parcel.analysis_neighborhood}<br />
            </Typography>
          </FlexBetween>
        </AccordionDetails>
      </Accordion>
      <Accordion disableGutters square>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <Typography fontWeight={550}>Planning and Zoning</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FlexBetween>
            <Typography>
              Zoning Code:<br />
              Zoning District:<br />
            </Typography>
            <Typography sx={{ textAlign: 'right' }}>
              {parcel.zoning_code}<br />
              {parcel.zoning_district}<br />
            </Typography>
          </FlexBetween>
        </AccordionDetails>
      </Accordion>
      <Accordion disableGutters square>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <Typography fontWeight={550}>Building Permits</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FlexBetween>
            <Typography>
              Supervisor District:<br />
              Supervisor:<br />
              Neighborhood:<br />
            </Typography>
            <Typography sx={{ textAlign: 'right' }}>
              District {parcel.supervisor_district}<br />
              {parcel.supname}<br />
              {parcel.analysis_neighborhood}<br />
            </Typography>
          </FlexBetween>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default Parcel;

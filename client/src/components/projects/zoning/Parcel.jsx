import React, { useState } from 'react';
import { Box, Accordion, AccordionSummary, AccordionDetails, Typography } from "@mui/material";
import { ExpandMore } from '@mui/icons-material';
import FlexBetween from 'components/FlexBetween';
import BuildingAccordion from 'components/projects/zoning/Building';
import { displayValueOrPlaceholder, formatNumber, formatAddress } from 'utils/parcels';

const Parcel = ({ parcelData }) => {
  if (!parcelData) {
    return <Box />;
  };

  const parcel = parcelData[0];
  console.log('parcelData at Parcel: ', parcelData);

  return (
    /* Enable overflow */
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', overflowY: 'auto' }}>
      <Typography variant='h5' fontWeight='550' sx={{ mb: '0.5rem' }}>Report: {parcel.blklot}</Typography>
      <Accordion disableGutters square>
        <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1-content" id="panel1-header">
          <Typography fontWeight={550}>Address/Legal</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FlexBetween>
            <Typography>
              Address(es)<br />
              Assessor Parcel Number<br />
              Block<br />
              Lot<br />
              Year Built<br />
            </Typography>
            <Typography sx={{ textAlign: 'right' }}>
              {formatAddress(parcel.from_address_num, parcel.to_address_num, parcel.street_name, parcel.street_type)}<br />
              {displayValueOrPlaceholder(parcel.blklot)}<br />
              {displayValueOrPlaceholder(parcel.block_num)}<br />
              {displayValueOrPlaceholder(parcel.lot_num)}<br />
              {displayValueOrPlaceholder(parcel.yrbuilt)}<br />
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
              Zoning Code<br />
              Zoning District<br />
              Land Use<br />
              Parcel Area<br />
              Parcel Perimeter<br />
              Assessed Land Val.<br />
              Assessed Building Val.<br />
            </Typography>
            <Typography sx={{ textAlign: 'right' }}>
              {displayValueOrPlaceholder(parcel.zoning_code)}<br />
              {displayValueOrPlaceholder(parcel.zoning_district)}<br />
              {displayValueOrPlaceholder(parcel.landuse)}<br />
              {formatNumber(parcel.st_area_sh)} (sq ft)<br />
              {formatNumber(parcel.st_length)} (ft)<br />
              {parcel.landval ? `$${formatNumber(parcel.landval)}` : formatNumber(parcel.landval)}<br />
              {parcel.strucval ? `$${formatNumber(parcel.strucval)}` : formatNumber(parcel.strucval)}<br />
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
              Supervisor District<br />
              Supervisor<br />
              Neighborhood<br />
            </Typography>
            <Typography sx={{ textAlign: 'right' }}>
              {parcel.supervisor_district ? `District ${displayValueOrPlaceholder(parcel.supervisor_district)}` : displayValueOrPlaceholder(parcel.supervisor_district)}<br />
              {displayValueOrPlaceholder(parcel.supervisor_name)}<br />
              {displayValueOrPlaceholder(parcel.analysis_neighborhood)}<br />
            </Typography>
          </FlexBetween>
        </AccordionDetails>
      </Accordion>
      <Accordion disableGutters square>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="buildings-content"
          id="buildings-header"
        >
          <Typography fontWeight={550}>Buildings ({parcel.buildingDetails?.length || 0})</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {parcel.buildingDetails && parcel.buildingDetails.length > 0 ? (
            parcel.buildingDetails.map(building => (
              <BuildingAccordion key={building._id} building={building} />
            ))
          ) : (
            <Typography>No buildings associated with this parcel.</Typography>
          )}
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default Parcel;

import React, { useState } from 'react';
import { Box, Accordion, AccordionSummary, AccordionDetails, Typography } from "@mui/material";
import { ExpandMore } from '@mui/icons-material';
import FlexBetween from 'components/FlexBetween';

const Parcel = ({ parcelData }) => {
  if (!parcelData) {
    return <Box />;
  };

  const parcel = parcelData[0];
  console.log('parcelData at Parcel: ', parcelData);

  const displayValueOrPlaceholder = (value, placeholder = 'N/A') => value ? value.toString() : placeholder;

  const formatNumber = (value, placeholder = 'N/A') => {
    return value ? Number.parseFloat(value).toFixed(2) : placeholder;
  };

  const formatAddress = (fromNum, toNum, streetName, streetType) => {
    let address = `${displayValueOrPlaceholder(streetName)} ${displayValueOrPlaceholder(streetType)}`;
    if (fromNum && toNum && fromNum === toNum) {
      return `${fromNum} ${address}`;
    } else if (fromNum && toNum) {
      return `${fromNum}-${toNum} ${address}`;
    } else {
      return 'N/A';
    }
    return address;
  };

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
              Parcel:<br />
              Block/Lot:<br />
              Address(es):<br />
              Year Built:<br />
            </Typography>
            <Typography sx={{ textAlign: 'right' }}>
              {displayValueOrPlaceholder(parcel.mapblklot)}<br />
              {displayValueOrPlaceholder(parcel.block_num)}/{displayValueOrPlaceholder(parcel.lot_num)}<br />
              {formatAddress(parcel.from_address_num, parcel.to_address_num, parcel.street_name, parcel.street_type)}<br />
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
              Land Use:<br />
              Lot/Parcel Area (sqft):<br />
              Street Length (ft):<br />
            </Typography>
            <Typography sx={{ textAlign: 'right' }}>
              {displayValueOrPlaceholder(parcel.zoning_code)}<br />
              {displayValueOrPlaceholder(parcel.zoning_district)}<br />
              {displayValueOrPlaceholder(parcel.landuse)}<br />
              {formatNumber(parcel.st_area_sh)}<br />
              {formatNumber(parcel.st_length)}<br />
            </Typography>
          </FlexBetween>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default Parcel;

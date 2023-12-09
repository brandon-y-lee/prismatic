import React from 'react';
import { Box, Typography, IconButton, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FlexBetween from 'components/FlexBetween';


const ModalHeader = ({ invoiceNumber, onClose }) => {

  return (
    <>
      <Box display='flex' flexDirection='column' px={3} py={1.5} gap='1rem'>
        <FlexBetween>
          <Typography variant="h5" fontWeight={525}>
            Invoice #{invoiceNumber}
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </FlexBetween>
      </Box>
      <Divider />
    </>
  );
};

export default ModalHeader;
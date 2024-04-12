import React, { useState } from 'react';
import { Box, List, ListItem, ListItemText, Paper, Typography, useMediaQuery } from '@mui/material';
import { useProjectData } from 'context/ProjectContext';
import { invertKey } from 'utils/project';
import MapBox from 'components/projects/zoning/MapBox';
import Search from 'components/projects/zoning/Search';
import Parcel from 'components/projects/zoning/Parcel';
import { useGetParcelQuery } from 'state/api';

const Zoning = () => {
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");  
  const { projectData } = useProjectData();

  const [parcelNumber, setParcelNumber] = useState('');
  const { data: parcelData, isLoading: isParcelLoading } = useGetParcelQuery({ blklot: parcelNumber }, { skip: !parcelNumber });

  const handleSearch = (query) => {
    console.log('query at zoning: ', query);
    setParcelNumber(query);
  };

  return (  
    <Box sx={{ width: '100%', mb: '2.5rem' }}>
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        sx={{
          gap: '1.5rem',
          "& > div": { 
            gridColumn: isNonMediumScreens ? undefined : "span 12",
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gridColumn: 'span 7',
            boxShadow: 'none',
            borderColor: 'grey.400',
            borderWidth: '1px',
            borderStyle: 'solid',
          }}
        >
          <MapBox parcelData={parcelData} onSearch={handleSearch} />
        </Box>
        <Box
          sx={{
            height: '70vh',
            display: 'flex',
            flexDirection: 'column',
            gridColumn: 'span 5',
            boxShadow: 'none',
            gap: '1rem'
          }}
        >
          <Search onSearch={handleSearch} />
          <Parcel parcelData={parcelData} />
        </Box>
      </Box>
    </Box>
  );
}

export default Zoning;

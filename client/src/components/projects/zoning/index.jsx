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
  console.log('Project Data at Zoning: ', projectData);

  const [parcelNumber, setParcelNumber] = useState('');
  const { data: parcelData, isLoading: isParcelLoading } = useGetParcelQuery({ mapblklot: parcelNumber }, { skip: !parcelNumber });

  const handleSearch = (query) => {
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
            gridColumn: 'span 7',
            transition: 'box-shadow 0.3s',
            boxShadow: 'none',
            borderColor: 'grey.400',
            borderWidth: '1px',
            borderStyle: 'solid',
            '&:hover': {
              boxShadow: theme => theme.shadows[2],
            },
          }}
        >
          <MapBox parcelData={parcelData} />
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

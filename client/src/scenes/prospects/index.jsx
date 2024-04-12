import React, { useState } from 'react';
import { Box, Divider, useMediaQuery } from '@mui/material';
import Header from 'components/Header';
import MapBox from 'components/projects/zoning/MapBox';
import Search from 'components/projects/zoning/Search';
import Parcel from 'components/projects/zoning/Parcel';
import Scanner from 'components/prospects/Scanner';
import { useGetParcelQuery } from 'state/api';

const Prospects = () => {
  const isNonMediumScreens = useMediaQuery('(min-width: 1200px)');  

  const [parcelNumber, setParcelNumber] = useState('');
  const { data: parcelData, isLoading: isParcelLoading } = useGetParcelQuery({ blklot: parcelNumber }, { skip: !parcelNumber });

  const handleSearch = (query) => {
    console.log('query at zoning: ', query);
    setParcelNumber(query);
  };

  return (  
    <Box sx={{ mb: '2.5rem' }}>
      <Box
        display='grid'
        gridTemplateColumns='repeat(12, 1fr)'
        sx={{
          '& > div': { 
            gridColumn: isNonMediumScreens ? undefined : 'span 12',
          },
        }}
      >
        <Box sx={{ gridColumn: 'span 12', mt: '1.5rem', mb: '1rem', mx: '2.5rem' }}>
          <Header title='Prospects' />
        </Box>

        <Box sx={{ gridColumn: 'span 12' }}>
          <Divider />
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gridColumn: 'span 4',
            boxShadow: 'none',
            m: isNonMediumScreens ? '1.5rem 0rem 1.5rem 1.5rem' : '1.5rem',
            gap: '1rem'
          }}
        >
          <Search onSearch={handleSearch} />
          <Scanner />
        </Box>
        <Box
          sx={{
            display: 'flex',
            height: '70vh',
            flexDirection: 'column',
            gridColumn: 'span 8',
            boxShadow: 'none',
            borderColor: 'grey.400',
            borderWidth: '1px',
            borderStyle: 'solid',
            m: '1.5rem',
          }}
        >
          <MapBox parcelData={parcelData} onSearch={handleSearch} />
        </Box>
      </Box>
    </Box>
  );
}

export default Prospects;

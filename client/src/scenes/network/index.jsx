import React, { useState } from 'react';
import { Box, Divider, useMediaQuery } from '@mui/material';
import Header from 'components/Header';
import MapBox from 'components/projects/zoning/MapBox';
import Search from 'components/network/Search';
import Parcel from 'components/projects/zoning/Parcel';
import Scanner from 'components/prospects/Scanner';
import { useGetParcelQuery } from 'state/api';
import Invitations from 'components/network/Invitations';
import Manage from 'components/network/navigation';
import Recommendations from 'components/network/Recommendations';

const Network = () => {
  const isNonMediumScreens = useMediaQuery('(min-width: 1200px)');  

  const [parcelNumber, setParcelNumber] = useState('');
  const { data: parcelData, isLoading: isParcelLoading } = useGetParcelQuery({ blklot: parcelNumber }, { skip: !parcelNumber });

  const handleSearch = (query) => {
    console.log('query at zoning: ', query);
    setParcelNumber(query);
  };

  return (  
    <Box sx={{ m: '1.5rem 2.5rem' }}>
      <Box sx={{ mb: '1rem' }}>
        <Header title='Network' />
      </Box>
      <Box
        display='grid'
        gridTemplateColumns='repeat(12, 1fr)'
        sx={{
          gap: '1.5rem',
          '& > div': { 
            gridColumn: isNonMediumScreens ? undefined : 'span 12',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gridColumn: 'span 4',
            boxShadow: 'none',
            gap: '1rem'
          }}
        >
          <Search onSearch={handleSearch} />
          <Manage />
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gridColumn: 'span 8',
            boxShadow: 'none',
            gap: '1rem'
          }}
        >
          <Invitations />
          <Recommendations />
        </Box>
      </Box>
    </Box>
  );
}

export default Network;

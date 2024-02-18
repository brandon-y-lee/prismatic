import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetTransactionsQuery } from 'state/api';
import { Box, Button, CircularProgress, useMediaQuery } from '@mui/material';

import Header from 'components/Header';
import FlexBetween from 'components/FlexBetween';
import ProjectBox from 'components/ProjectBox';
import AllProjects from 'components/transactions/data/AllProjects';
import DraftProjects from 'components/transactions/data/DraftProjects';
import ActiveProjects from 'components/transactions/data/ActiveProjects';
import InReviewProjects from 'components/transactions/data/InReviewProjects';
import NotApprovedProjects from 'components/transactions/data/NotApprovedProjects';

import { getLoggedInUser } from 'utils/token';

const Orders = () => {
  const user = getLoggedInUser();
  const navigate = useNavigate();

  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [sort, setSort] = useState({});
  const [search, setSearch] = useState("");

  const [selectedKpi, setSelectedKpi] = useState(null);

  /* Potentially get rid of this and call it once in useEffect */
  const { data, isLoading, isError } = useGetTransactionsQuery({
    userId: user.authId,
    page,
    pageSize,
    sort: JSON.stringify(sort),
    search,
  });

  const handleKpiSelect = (kpiType) => {
    setSelectedKpi(kpiType.toLowerCase());
    console.log('selectedKpi: ', selectedKpi);
  };

  const handleCreateOrder = () => {
    navigate('/orders/create');
  };

  const handleAllProjects = () => {
    setSelectedKpi(null);
  };

  const generateButton = (label, onClick, variant, bcolor, color) => (
    <Button
      variant={variant}
      size="large"
      onClick={onClick}
      sx={{
        transition: 'box-shadow 0.3s',
        boxShadow: 'none',
        backgroundColor: bcolor,
        borderColor: bcolor,
        borderWidth: '1px',
        borderStyle: 'solid',
        color: color,
        padding: '0.5rem 1rem',
        height: '100%',
        '&:hover': {
          boxShadow: theme => theme.shadows[3],
          backgroundColor: bcolor,
          borderColor: bcolor,
          borderWidth: '1px',
          borderStyle: 'solid',
          color: color,
        },
      }}
    >
      {label}
    </Button>
  );

  const renderDataGrid = () => {
    switch (selectedKpi) {
      case 'draft':
        return <DraftProjects data={data} />;
      case 'active':
        return <ActiveProjects data={data} />;
      case 'in review':
        return <InReviewProjects data={data} />;
      case 'not approved':
        return <NotApprovedProjects data={data} />;
      default:
        return <AllProjects data={data} />;
    }
  };

  if (isLoading) {
    return <CircularProgress />;
  };

  if (isError || !data) {
    return <Box>Error loading transactions.</Box>;
  };

  return (
    <Box m="1.5rem 2.5rem">
      <FlexBetween>
        <Header title="Projects" />
        <FlexBetween sx={{ gap: 3 }}>
          {generateButton("All Projects", handleAllProjects, 'outlined', 'grey.300', 'grey.600')}
          {generateButton("New Project", handleCreateOrder, 'outlined', '#1677FF', 'white')}
        </FlexBetween>
      </FlexBetween>

      <Box
        my="20px"
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="30px"
        sx={{
          "& > div": { gridColumn: isNonMediumScreens ? undefined : "span 12" },
        }}
      >
        {/* ROW 1 */}
        <ProjectBox
          title="Draft"
          onSelect={handleKpiSelect}
        />
        <ProjectBox
          title="In Review"
          onSelect={handleKpiSelect}
        />
        <ProjectBox
          title="Active"
          onSelect={handleKpiSelect}
        />
        <ProjectBox
          title="Not Approved"
          onSelect={handleKpiSelect}
        />
      </Box>

      {renderDataGrid()}
    </Box>
  );
};

export default Orders;
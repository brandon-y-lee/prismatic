import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Box, Paper, Divider, Tabs, Tab } from '@mui/material';
import PageLoader from 'components/PageLoader';

import { useViewProjectQuery } from 'state/api';
import Header from 'components/projects/view/Header';
import Status from 'components/projects/view/Status';
import Scope from 'components/projects/Scope';
import Budget from 'components/projects/Budget';

const View = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { data: projectData, isLoading } = useViewProjectQuery(id);
  console.log("Project Data: ", projectData);

  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const pathSegments = location.pathname.split('/');
    const lastSegment = pathSegments[pathSegments.length - 1];

    const tabIndexMap = {
      '': 0, // index route for Scope
      'budget': 1,
      'team': 2,
    };

    setTabValue(tabIndexMap[lastSegment] ?? 0);
  }, [location]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    const paths = ['', 'budget', 'team'];
    navigate(`/projects/view/${id}/${paths[newValue]}`);
  };

  if (isLoading) {
    return <PageLoader />;
  };

  if (!projectData) {
    return <Box>Project not found.</Box>;
  };

  return (
    <Box display="flex" flexDirection="column" m="1.5rem 2.5rem 1.5rem 2.5rem" gap="1rem">
      <Paper
        sx={{
          transition: 'box-shadow 0.3s',
          boxShadow: 'none',
          borderColor: 'grey.300',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderRadius: '16px',
          marginBottom: '1rem',
          '&:hover': {
            boxShadow: theme => theme.shadows[3],
          },
        }}
      >
        <Box sx={{ padding: '1.5rem 2.5rem 0rem 2.5rem' }}>
          <Header project={projectData.title} summary={projectData.summary} status={projectData.status} />
          <Status status={projectData.status} />
        </Box>

        <Divider />

        <Box sx={{ padding: '1.5rem 2.5rem 1.5rem 2.5rem' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="project-tabs"
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: '500',
                fontSize: '14px',
                color: 'black',
                borderColor: 'grey.300',
                borderWidth: '1px',
                borderStyle: 'solid',
                '&.Mui-selected': {
                  backgroundColor: 'white',
                  color: 'black',
                },
                '&:not(.Mui-selected)': {
                  backgroundColor: '#f5f5f5',
                },
              }
            }}
          >
            <Tab label="Scope" />
            <Tab label="Budget" />
            <Tab label="Team" />
            <Tab label="Materials" />
            <Tab label="Permits" />
            <Tab label="Communication" />
            <Tab label="Modeling" />
            <Tab label="Estimates" />
          </Tabs>
        </Box>
      </Paper>

      {/* Render the active tab component */}
      <Box>
        <Outlet />
      </Box>
    </Box>
  );
};

export default View;

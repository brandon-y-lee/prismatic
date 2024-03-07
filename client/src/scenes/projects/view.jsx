import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Box, Paper, Divider, Tabs, Tab } from '@mui/material';
import PageLoader from 'components/PageLoader';
import Header from 'components/projects/view/Header';
import Status from 'components/projects/view/Status';
import { useViewProjectQuery } from 'state/api';

const View = () => {
  const { id } = useParams();
  console.log('id: ', id);
  const navigate = useNavigate();
  const location = useLocation();
  const { data: projectData, isLoading } = useViewProjectQuery(id);
  console.log("Project Data: ", projectData);

  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const pathSegments = location.pathname.split('/');
    const viewIndex = pathSegments.findIndex(segment => segment === 'view');
    const projectIdSegment = pathSegments[viewIndex + 1];
    const subRouteSegment = pathSegments[viewIndex + 2];
  
    const tabIndexMap = {
      '': 0, // Scope
      'budget': 1,
      'crews': 2,
      'team': 3,
      'timeline': 4,
    };
  
    setTabValue(tabIndexMap[subRouteSegment] ?? 0);
  }, [location]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    const paths = ['', 'budget', 'crews', 'team', 'timeline'];
    navigate(`/projects/view/${id}/${paths[newValue]}`);
  };

  if (isLoading) {
    return <PageLoader />;
  };

  if (!projectData) {
    return <Box>Project not found.</Box>;
  };

  return (
    <Box display="flex" flexDirection="column" sx={{ m: "1.5rem 2.5rem", gap: "1rem" }}>
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
            variant="fullWidth"
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
                  fontWeight: '550'
                },
                '&:not(.Mui-selected)': {
                  backgroundColor: '#f5f5f5',
                },
                '&:hover': {
                  backgroundColor: 'white',
                  color: 'black',
                  fontWeight: '550'
                }
              }
            }}
          >
            <Tab label="Scope" />
            <Tab label="Budget" />
            <Tab label="Crews" />
            <Tab label="Team" />
            <Tab label="Timeline" />
            <Tab label="Materials" />
            <Tab label="Permits" />
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

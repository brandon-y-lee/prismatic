import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Box, Paper, Divider, Tabs, Tab } from '@mui/material';
import PageLoader from 'components/PageLoader';
import Header from 'components/projects/view/Header';
import Status from 'components/projects/view/Status';
import { useViewProjectQuery } from 'state/api';
import { ProjectProvider } from 'context/ProjectContext';

const View = () => {
  const location = useLocation();
  const [tabValue, setTabValue] = useState(0);
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: projectData, isLoading } = useViewProjectQuery(id);

  useEffect(() => {
    const pathSegments = location.pathname.split('/');
    const viewIndex = pathSegments.findIndex(segment => segment === 'view');
    const subRouteSegment = pathSegments[viewIndex + 2];
  
    const tabIndexMap = {
      '': 0, // Overview
      'zoning': 1,
      'budget': 2,
      'crews': 3,
      'team': 4,
      'timeline': 5,
    };
  
    setTabValue(tabIndexMap[subRouteSegment] ?? 0);
  }, [location]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    const paths = ['', 'zoning', 'budget', 'crews', 'team', 'timeline'];
    navigate(`/projects/view/${id}/${paths[newValue]}`);
  };

  if (isLoading) {
    return <PageLoader />;
  };

  if (!projectData) {
    return <Box>Project not found.</Box>;
  };

  return (
    <ProjectProvider projectData={projectData} isLoading={isLoading}>
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
            <Header project={projectData} />
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
              <Tab label="Overview" />
              <Tab label="Zoning" />
              <Tab label="Budget" />
              <Tab label="Crews" />
              <Tab label="Team" />
              <Tab label="Timeline" />
              <Tab label="Materials" />
              <Tab label="Permits" />
              <Tab label="Estimates" />
            </Tabs>
          </Box>
        </Paper>

        {/* Render the active tab component */}
        <Outlet />
      </Box>
    </ProjectProvider>
  );
};

export default View;

import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Box, Paper, Divider, Tabs, Tab } from '@mui/material';
import { useViewProjectQuery } from 'state/api';
import { ProjectProvider } from 'context/ProjectContext';
import PageLoader from 'components/PageLoader';
import Header from 'components/projects/view/Header';
import Status from 'components/projects/view/Update';
import Assistant from 'components/Assistant';

const View = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [tabValue, setTabValue] = useState(0);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const { data: projectData, isLoading } = useViewProjectQuery(id);

  const handlePaperClick = () => {
    setIsAssistantOpen(true);
  };
  
  useEffect(() => {
    const pathSegments = location.pathname.split('/');
    const viewIndex = pathSegments.findIndex(segment => segment === 'view');
    const subRouteSegment = pathSegments[viewIndex + 2];
  
    const tabIndexMap = {
      '': 0, // Overview
      'zoning': 1,
      'budget': 2,
      'crews': 3,
      'timeline': 4,
      'planning': 5
    };
  
    setTabValue(tabIndexMap[subRouteSegment] ?? 0);
  }, [location]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    const paths = ['', 'zoning', 'budget', 'crews', 'timeline', 'planning'];
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
          <Box sx={{ p: '1.5rem 2.5rem' }}>
            <Header project={projectData} />
          </Box>

          <Divider />

          <Box sx={{ p: '1.5rem 2.5rem' }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="project-tabs"
              variant="fullWidth"
              TabIndicatorProps={{ sx: { display: 'none' } }}
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
                  },
                  '&:first-of-type': {
                    borderTopLeftRadius: '14px',
                    borderBottomLeftRadius: '14px'
                  },
                  '&:last-of-type': {
                    borderTopRightRadius: '14px',
                    borderBottomRightRadius: '14px'
                  },
                }
              }}
            >
              <Tab label="Overview" />
              <Tab label="Zoning" />
              <Tab label="Budget" />
              <Tab label="Crews" />
              <Tab label="Timeline" />
              <Tab label="Planning" />
              <Tab label="Compliance" />
            </Tabs>
          </Box>
        </Paper>

        <Assistant open={isAssistantOpen} onClose={() => setIsAssistantOpen(false)} />

        {/* Render the active tab component */}
        <Outlet />
      </Box>
    </ProjectProvider>
  );
};

export default View;

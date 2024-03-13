import React, { useState } from 'react';
import { Masonry } from '@mui/lab';
import { Box, List, ListItem, ListItemText, Paper, Typography, useMediaQuery } from '@mui/material';
import { useProjectData } from 'context/ProjectContext';
import { invertKey } from 'utils/project';

const Zoning = () => {
  const { projectData, isLoading } = useProjectData();
  console.log('Project data at zoning: ', projectData);

  const renderList = (data) => {
    return Object.entries(data)
      .filter(([key]) => key !== '_id')
      .map(([key, value]) => {
        const originalKey = invertKey(key);
        const displayValue = typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value;
        return (
          <ListItem key={key} secondaryAction={
            <Typography variant="body2" color="text.secondary">
              {displayValue}
            </Typography>
          }>
            <ListItemText primary={originalKey} />
          </ListItem>
        );
      });
  };

  const renderSchemas = () => {
    return Object.entries(projectData?.zoning || {})
      .map(([schemaName, schemaData]) => {
        const schemaTitle = invertKey(schemaName);
        return renderSchema(schemaTitle, schemaData);
      });
  };

  const renderSchema = (title, data) => {
    return (
      <Paper
        key={title}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          transition: 'box-shadow 0.3s',
          boxShadow: 'none',
          borderColor: 'grey.300',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderRadius: '16px',
          padding: '1.5rem 2rem',
          '&:hover': {
            boxShadow: theme => theme.shadows[3],
          },
        }}
      >
        <Typography variant="h5" fontWeight={550} marginBottom={1}>
          {title}
        </Typography>
        <List dense>{renderList(data)}</List>
      </Paper>
    );
  };

  return (  
    <Box sx={{ mb: '2.5rem' }}>
      <Masonry columns={2} spacing={2}>
        {renderSchemas()}
      </Masonry>
    </Box>
  );
}

export default Zoning;

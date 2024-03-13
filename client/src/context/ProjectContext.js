import React, { createContext, useContext } from 'react';

export const ProjectContext = createContext();

export const useProjectData = () => useContext(ProjectContext);

export const ProjectProvider = ({ children, projectData, isLoading }) => {
  const value = { projectData, isLoading };
  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};
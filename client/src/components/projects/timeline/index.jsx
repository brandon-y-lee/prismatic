import React, { useRef } from 'react';
import { GanttComponent, Inject, Edit, Resize, Sort, Selection, ColumnMenu, ColumnsDirective, ColumnDirective, AddDialogFieldsDirective, AddDialogFieldDirective, EditDialogFieldsDirective, EditDialogFieldDirective, Toolbar } from '@syncfusion/ej2-react-gantt';
import { Box, Button } from '@mui/material';
import './index.css';

const projectResources = [
  { resourceId: 1, resourceName: 'Chester' },
  { resourceId: 2, resourceName: 'Killian' },
  { resourceId: 3, resourceName: 'Michael' },
  { resourceId: 4, resourceName: 'Vikram' }
];

const data = [
  {
    taskID: 1,
    taskName: 'Project Initiation',
    startDate: new Date('04/02/2019'),
    endDate: new Date('04/21/2019'),
    subtasks: [
      { taskID: 2, taskName: 'Identify Site location', startDate: new Date('04/02/2019'), duration: 4, progress: 50, resources: [2, 3] },
      { taskID: 3, taskName: 'Perform Soil test', startDate: new Date('04/02/2019'), duration: 4, progress: 50, resources: [2] },
      { taskID: 4, taskName: 'Soil test approval', startDate: new Date('04/02/2019'), duration: 4, Predecessor: '3FS', progress: 50, resources: [1] },
    ]
  },
  {
    taskID: 5,
    taskName: 'Project Estimation',
    startDate: new Date('04/02/2019'),
    endDate: new Date('04/21/2019'),
    subtasks: [
      { taskID: 6, taskName: 'Develop floor plan for estimation', startDate: new Date('04/04/2019'), duration: 3, progress: 50 },
      { taskID: 7, taskName: 'List materials', startDate: new Date('04/04/2019'), duration: 3, progress: 50, resources: [1, 2, 3] },
      { taskID: 8, taskName: 'Estimation approval', startDate: new Date('04/04/2019'), duration: 3, Predecessor: '7SS', progress: 50 }
    ]
  },
];

const Timeline = () => {

  const taskFields = {
    id: 'taskID',
    name: 'taskName',
    startDate: 'startDate',
    duration: 'duration',
    progress: 'progress',
    child: 'subtasks',
    dependency: 'Predecessor',
    resourceInfo: 'resources'
  };

  const labelSettings = {
    rightLabel: 'resources',
    taskLabel: '${progress}%'
  };

  const editSettings = {
    allowAdding: true,
    allowEditing: true,
    allowDeleting: true,
    allowTaskbarEditing: true,
    showDeleteConfirmDialog: true,
    edit: 'Dialog',
  };

  const toolbar = ['Add', 'Edit', 'Delete', 'Cancel', 'Update', 'ExpandAll', 'CollapseAll'];

  const splitterSettings = {
    columnIndex : 3
  };

  const resourceFields = {
    id: 'resourceId',
    name: 'resourceName',
  };

  let ganttInstance;

  function zoomIn() {
    ganttInstance.zoomIn();
  };

  function zoomOut() {
    ganttInstance.zoomOut();
  };

  function fitToProject() {
    ganttInstance.fitToProject();
  };

  return (
    <Box sx={{ mb: '2.5rem' }}>
      <Box sx={{ m: 0.5 }}>
        <Button variant='text' color='info' onClick={zoomIn}>Zoom In</Button>
        <Button variant='text' color='info' onClick={zoomOut}>Zoom Out</Button>
        <Button variant='text' color='info' onClick={fitToProject}>Fit To Project</Button>
      </Box>
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        sx={{
          gap: '1.5rem',
          "& > div": { 
            gridColumn: "span 12",
          },
        }}
      >
        <GanttComponent
          ref={gantt => ganttInstance = gantt}
          toolbar={toolbar}
          dataSource={data}
          taskFields={taskFields}
          editSettings={editSettings}
          labelSettings={labelSettings}
          splitterSettings={splitterSettings}
          resourceFields={resourceFields}
          resources={projectResources}
          allowSelection={true}
          allowResizing={true}
          allowSorting={true}
          showColumnMenu={true}
          rowHeight={50}
          width='100%'
          height='100%'
        >
          <ColumnsDirective>
            <ColumnDirective field='taskID' minWidth='75' width='100' maxWidth='125' />
            <ColumnDirective field='taskName' headerText='Task Name' minWidth='200' width='250' maxWidth='300' />
            <ColumnDirective field='startDate' minWidth='100' width='125' maxWidth='150' />
            <ColumnDirective field='duration' minWidth='100' width='125' maxWidth='150' />
            <ColumnDirective field='Predecessor' minWidth='100' width='125' maxWidth='150' />
            <ColumnDirective field='progress' minWidth='75' width='100' maxWidth='125' format='P2' />
          </ColumnsDirective>

          <AddDialogFieldsDirective>
            <AddDialogFieldDirective type='General' headerText='General' />
            <AddDialogFieldDirective type='Dependency' />
          </AddDialogFieldsDirective>
          <EditDialogFieldsDirective>
            <EditDialogFieldDirective type='General' headerText='General' />
            <EditDialogFieldDirective type='Dependency' />
            <EditDialogFieldDirective type='Resources' />
          </EditDialogFieldsDirective>
          <Inject services={[Toolbar, Edit, Selection, Resize, Sort, ColumnMenu]} />
        </GanttComponent>
      </Box>
    </Box>
  );
};

export default Timeline;

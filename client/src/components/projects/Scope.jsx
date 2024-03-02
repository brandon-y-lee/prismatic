import React, { useState } from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText, IconButton, Paper, Typography, Tabs, Tab, useMediaQuery, useTheme } from '@mui/material';
import { ResponsiveBar } from '@nivo/bar';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';


const Scope = () => {
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const data = [
    {
      "name": "Budgeting",
      "complete": 100,
    },
    {
      "name": "Design",
      "complete": 60,
    },
    {
      "name": "Contracts",
      "complete": 40,
    },
    {
      "name": "Permits",
      "complete": 15,
    },
    {
      "name": "Sourcing",
      "complete": 80,
    },
  ];  

  const CustomizedAxisTick = ({ x, y, payload, visibleTicksCount, index, data }) => {
    const value = data[index] ? data[index].complete : '';
    
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={-120} y={0} dy={5} textAnchor="start" fill="#03045E" fontSize={14}>
          {payload.value}
        </text>
        <text x={0} y={0} dy={5} textAnchor="end" fill="#03045E" fontSize={14} fontWeight={550}>
          {`${value}%`}
        </text>
      </g>
    );
  };

  return (  
    <Box sx={{ minHeight: 'calc(100vh - 3rem)' }}>
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        sx={{
          gap: '1.5rem',
          "& > div": { 
            gridColumn: isNonMediumScreens ? "span 6" : "span 12",
          },
        }}
      >
        <Paper
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
          {/* Title "Tasks" */}
          <Typography variant='h5' fontWeight={550} marginBottom={1}>
            Tasks
          </Typography>

          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={activeTab}
              onChange={handleTabChange}
              aria-label="task-tabs"
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: '500',
                  fontSize: '14px',
                  '&.Mui-selected': {
                    color: 'black',
                    fontWeight: '550'
                  },
                  '&:not(.Mui-selected)': {
                    color: 'grey',
                  },
                }
              }}
            >
              <Tab label="Upcoming" />
              <Tab label="Overdue" />
              <Tab label="Completed" />
            </Tabs>
          </Box>

          {/* List of Tasks */}
          <List>
            {['Get permit signed by city', 'Sign contract with general contractor'].map((text, index) => (
              <ListItem key={text} secondaryAction={
                <Typography variant="body2" color="text.secondary">
                  May 30, 2023
                </Typography>
              }>
                <ListItemIcon>
                  <IconButton edge="end" aria-label="comments">
                    {activeTab === 2 ? <CheckCircleOutlineIcon /> : <RadioButtonUncheckedIcon />}
                  </IconButton>
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </Paper>

        <Paper
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
          {/* Title "Progress" */}
          <Typography variant='h5' fontWeight={550} marginBottom={1}>
            Progress
          </Typography>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data} layout='vertical' margin={{ left: 50 }}>
              <defs>
                <linearGradient id="gradientFill" x1="0" x2="1" y1="0.25" y2="1">
                  <stop offset="0%" stopColor="#00B4D8" />
                  <stop offset="100%" stopColor="#023E8A" />
                </linearGradient>
              </defs>
              <XAxis type="number" domain={[0, 100]} hide />
              <YAxis
                dataKey="name"
                type="category"
                axisLine={false}
                tickLine={false}
                tick={(props) => <CustomizedAxisTick {...props} data={data} />}
                width={80}
              />
              <Bar dataKey="complete" fill="url(#gradientFill)" barSize={8} />
            </BarChart>
          </ResponsiveContainer>
        </Paper>

        <Paper
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
          {/* Title "Tasks" */}
          <Typography variant='h5' fontWeight={550} marginBottom={1}>
            Status Updates
          </Typography>

          {/* List of Tasks */}
          <List>
            {['Get started using My Tasks', 'Find the layout that\'s right for you'].map((text, index) => (
              <ListItem key={text} secondaryAction={
                <Typography variant="body2" color="text.secondary">
                  May 30, 2023
                </Typography>
              }>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>
    </Box>
  );
}

export default Scope;

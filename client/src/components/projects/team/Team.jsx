import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Avatar, Box, Paper, Typography, Button, Stack, useMediaQuery, Grid } from '@mui/material';
import { Add, AddCircleOutlined, More, MoreHorizOutlined } from '@mui/icons-material';
import FlexBetween from 'components/FlexBetween';
import AddTeamMember from './AddTeamMember';

const Team = () => {
  const id = useParams();
  const navigate = useNavigate();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");

  const [openAddDialog, setOpenAddDialog] = useState(false);

  const handleAddTeamMember = () => {
    setOpenAddDialog(true);
  };
  
  const teamMembers = [
    { name: 'Killian Joseph M...', color: 'teal', role: 'Architect' },
    { name: 'Brandon Lee', color: 'blue', role: 'Contractor' },
    { name: 'Michael Smith', color: 'amber', role: 'Engineer' },
    { name: 'Chester Zelaya', color: 'red', role: 'Planner' },
    // ... more members
  ];

  return (  
    <Box sx={{ minHeight: 'calc(100vh - 3rem)' }}>
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        sx={{
          gap: '1.5rem',
          "& > div": { 
            gridColumn: isNonMediumScreens ? "span 8" : "span 12",
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
            gap: '1rem',
            '&:hover': {
              boxShadow: theme => theme.shadows[3],
            },
          }}
        >
          <FlexBetween>
            {/* Title "Tasks" */}
            <Typography variant='h5' fontWeight={550} marginBottom={1}>
              Team ({teamMembers.length})
            </Typography>
            <Button
              startIcon={<Add />}
              color='info'
              sx={{ fontWeight: 600 }}
              onClick={handleAddTeamMember}
            >
              Add Team Member
            </Button>
          </FlexBetween>

          <Grid container spacing={2} sx={{ width: '100%' }}>
            {teamMembers.map((member, index) => (
              <Grid item xs={12} sm={4} key={index}>
                <Box display="flex" flexDirection="row" sx={{ gap: 1 }}>
                  <Avatar sx={{ bgcolor: member.color, margin: 1 }}>
                    {member.picture ? <img src={member.picture} alt={member.name} /> : member.name.match(/\b(\w)/g).join('')}
                  </Avatar>
                  <Box display="flex" flexDirection="column" sx={{ justifyContent: 'center' }}>
                    <Typography noWrap sx={{ fontWeight: 550 }}>
                      {member.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {member.role}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}

            <Grid item xs={4}>
              <Box display="flex" flexDirection="row" sx={{ gap: 1 }}>
                <Avatar sx={{ margin: 1 }}>
                  {<MoreHorizOutlined />}
                </Avatar>
                <Box display="flex" flexDirection="column" sx={{ justifyContent: 'center' }}>
                  <Typography noWrap sx={{ fontWeight: 550 }}>
                    Manage Team
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>

          <AddTeamMember open={openAddDialog} onClose={() => setOpenAddDialog(false)} teamMembers={teamMembers} />

        </Paper>
      </Box>
    </Box>
  );
}

export default Team;

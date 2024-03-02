import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Avatar, Box, Paper, Typography, Button, Stack, useMediaQuery, Grid, IconButton, Divider } from '@mui/material';
import { Add, MoreHorizOutlined, CreateOutlined, Circle, GroupOutlined } from '@mui/icons-material';
import FlexBetween from 'components/FlexBetween';
import AddTeamMember from './AddTeamMember';
import Message from './Message';
import CreateNewMessage from './CreateNewMessage';

const Team = () => {
  const id = useParams();
  const navigate = useNavigate();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");

  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openMessageDialog, setOpenMessageDialog] = useState(false);

  const handleAddTeamMember = () => {
    setOpenAddDialog(true);
  };

  const handleCreateNewMessage = () => {
    setOpenMessageDialog(true);
  }
  
  const teamMembers = [
    { name: 'Brandon Lee', color: 'blue', role: 'Contractor' },
    { name: 'Michael Smith', color: 'amber', role: 'Engineer' },
    { name: 'Killian Joseph M...', color: 'teal', role: 'Architect' },
    { name: 'Chester Zelaya', color: 'red', role: 'Planner' },
  ];

  const messages = [
    {
      team: "Marketing",
      title: "Re: Update on our latest campaign",
      author: "Blake Pham",
      date: "7 January, 2021",
      body: "Hey Daniela,\n\nAny update on our latest campaign? See tasks below:\n- Diversity blog post\n- Rewrite blog post"
    },
    {
      team: "Product Design",
      title: "Feedback on the new design mockups",
      author: "Avery Stewart",
      date: "12 March, 2021",
      body: "Hello Team,\n\nI've attached the new design mockups for the homepage redesign. Please review them and provide your feedback by EOD."
    },
    {
      team: "Engineering",
      title: "Sprint Planning Meeting Notes",
      author: "Jordan Lee",
      date: "22 March, 2021",
      body: "Team,\n\nThe sprint planning meeting highlighted the following priorities for the next two weeks:\n- Finalize the API endpoints\n- Update the authentication flow\n- Resolve bugs reported in the ticketing system"
    }
  ];

  return (  
    <Box sx={{ minHeight: 'calc(100vh - 3rem)' }}>
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        sx={{
          gap: '1.5rem',
          mb: '1.5rem',
          "& > div": { 
            gridColumn: isNonMediumScreens ? undefined : "span 12",
          },
        }}
      >
        <Paper
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gridColumn: 'span 7',
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
            <Typography variant='h5' fontWeight={550}>
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

          <Grid container spacing={2} sx={{ width: '100%', mb: 1 }}>
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

        <Paper
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gridColumn: 'span 5',
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
          {/* Title "Tasks" */}
          <Typography variant='h5' fontWeight={550}>
            What's the status?
          </Typography>
          
          <FlexBetween>
            <Button
              startIcon={<Circle fontSize='small' />}
              color='success'
              sx={{ fontWeight: 600 }}
            >
              On track
            </Button>
            <Button
              startIcon={<Circle fontSize='small' />}
              color='warning'
              sx={{ fontWeight: 600 }}
            >
              At risk
            </Button>
            <Button
              startIcon={<Circle fontSize='small' />}
              color='error'
              sx={{ fontWeight: 600 }}
            >
              Off track
            </Button>
          </FlexBetween>
        </Paper>

        <Paper
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gridColumn: 'span 6',
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
            <Typography variant='h5' fontWeight={550}>
              Messages
            </Typography>
            <Button
              startIcon={<CreateOutlined />}
              color='info'
              sx={{ fontWeight: 600 }}
              onClick={handleCreateNewMessage}
            >
              Send Message To Team
            </Button>
          </FlexBetween>

          <CreateNewMessage open={openMessageDialog} onClose={() => setOpenMessageDialog(false)} teamMembers={teamMembers} />
        </Paper>

        {messages.map((message, index) => (
          <Message
            key={index}
            author={message.author}
            team={message.team}
            title={message.title}
            subtitle={`Created by ${message.author} on ${message.date}`}
            messageBody={message.body}
            onReply={() => {/* function to handle reply */}}
          />
        ))}
      </Box>
    </Box>
  );
}

export default Team;

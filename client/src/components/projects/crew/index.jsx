import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Avatar, Box, Paper, Typography, Button, Stack, useMediaQuery, Grid, IconButton, Divider, CircularProgress } from '@mui/material';
import { Add, MoreHorizOutlined, CreateOutlined, Circle, GroupOutlined } from '@mui/icons-material';
import FlexBetween from 'components/FlexBetween';
import AddCrewMember from './AddCrewMember';
import Message from './Message';
import CreateNewMessage from './CreateNewMessage';
import { useGetCrewQuery, useGetMessagesQuery } from 'state/api';

const Crew = () => {
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
  const navigate = useNavigate();

  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openMessageDialog, setOpenMessageDialog] = useState(false);

  const { id, crewId } = useParams();
  const { data: crew, isLoading: isCrewLoading } = useGetCrewQuery(crewId);
  const { data: messages, isLoading: isMessagesLoading } = useGetMessagesQuery({ projectId: id, crewId });
  console.log('messages at crew: ', messages);

  const handleAddCrewMember = () => {
    setOpenAddDialog(true);
  };

  const handleCreateNewMessage = () => {
    setOpenMessageDialog(true);
  }

  const mockMessages = [
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

  if (isCrewLoading) return <CircularProgress />;
  if (!crew) return <Box>Crew not found.</Box>;

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
              {crew.name} ({crew.members.length})
            </Typography>
            <Button
              startIcon={<Add />}
              color='info'
              sx={{ fontWeight: 600 }}
              onClick={handleAddCrewMember}
            >
              Add Crew Member
            </Button>
          </FlexBetween>

          <Grid container spacing={2} sx={{ width: '100%', mb: 1 }}>
            {crew.members.map((member, index) => (
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
                    Manage Crew
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>

          <AddCrewMember 
            open={openAddDialog}
            onClose={() => setOpenAddDialog(false)}
            crewMembers={crew.members}
          />
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

          <CreateNewMessage
            open={openMessageDialog}
            onClose={() => setOpenMessageDialog(false)}
            crewName={crew && crew.name}
            crewMembers={crew && crew.members}
          />
        </Paper>

        {isMessagesLoading ? <CircularProgress /> : messages && messages.map((message, index) => (
          <Message
            key={index}
            message={message}
            onReply={() => {/* function to handle reply */}}
          />
        ))}
      </Box>
    </Box>
  );
}

export default Crew;

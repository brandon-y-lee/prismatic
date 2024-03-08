import React, { useState } from 'react';
import {
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField,
  Checkbox,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Box,
  Typography,
} from "@mui/material";
import { AddCircleOutline, CheckCircle, Search } from '@mui/icons-material';
import { useCreateCrewMutation, useGetContractorsQuery } from 'state/api';
import { getLoggedInUser } from 'utils/token';
import { useParams } from 'react-router-dom';


const AddCrew = ({ open, onClose }) => {
  const user = getLoggedInUser();
  const { id } = useParams();
  const [crewName, setCrewName] = useState('');
  const [crewMembers, setCrewMembers] = useState(new Set());
  const [crewLead, setCrewLead] = useState(null);
  const [createCrew, { isLoading: isCreatingCrew }] = useCreateCrewMutation();
  const { data: contractors, isLoading: isContractorsLoading } = useGetContractorsQuery(undefined, { skip: !open });

  const handleCrewNameChange = (event) => {
    setCrewName(event.target.value);
  };

  const handleMemberSelection = (id) => {
    setCrewMembers((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else{
        newSelected.add(id);
      }
      return newSelected;
    });
  };

  const handleSetCrewLead = (id) => {
    setCrewLead(id);
  };

  const handleSubmit = async () => {
    const crewData = {
      name: crewName,
      projectId: id,
      memberIds: Array.from(crewMembers),
      leadId: crewLead,
      createdBy: user.userId,
    };

    try {
      await createCrew(crewData).unwrap();
      setCrewName('');
      setCrewMembers(new Set());
      setCrewLead(null);
    } catch (error) {
      console.error('Failed to create crew: ', error);
    } finally {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ fontWeight: '550' }}>Select Crew Members and Crew Lead</DialogTitle>
      <DialogContent>
        <Box
          display="grid"
          gridTemplateColumns="repeat(12, 1fr)"
          sx={{ gap: '1rem', maxHeight: '60vh' }}
        >
          <Box display="flex" flexDirection="column" sx={{ gridColumn: 'span 8', gap: '1rem' }}>
            <Box sx={{ position: 'sticky', top: 0, zIndex: 2 }}>
              <TextField
                fullWidth
                id="search-employee"
                type="text"
                variant="outlined"
                placeholder="Search"
                size="small"
                InputProps={{
                  endAdornment: <Search />
                }}
                sx={{ mb: 1, mr: 1 }}
              />
              <Typography variant='h6' fontWeight={550}>
                All Employees ({contractors?.length})
              </Typography>
            </Box>
            <List sx={{ overflowY: 'auto', maxHeight: '50vh', pr: 1 }}>
              {!isContractorsLoading && contractors?.map((contractor) => (
                <ListItem 
                  key={contractor._id}
                  dense
                  secondaryAction={
                    <Button
                      variant="outlined"
                      color="info"
                      size="small"
                      onClick={() => handleSetCrewLead(contractor._id)}
                      disabled={!crewMembers.has(contractor._id)}
                    >
                      {crewLead === contractor._id ? 'Crew Lead' : 'Set as Crew Lead'}
                    </Button>
                  }
                >
                  <ListItemIcon sx={{ minWidth: '30px' }}>
                    <Checkbox
                      checked={crewMembers.has(contractor._id)}
                      onChange={() => handleMemberSelection(contractor._id)}
                      tabIndex={-1}
                      disableRipple
                      icon={<AddCircleOutline />}
                      checkedIcon={<CheckCircle color='success' />}
                    />
                  </ListItemIcon>
                  <Avatar sx={{ mx: 1 }}>{contractor.name[0]}</Avatar>
                  <ListItemText primary={contractor.name} secondary={contractor.role} />
                </ListItem>
              ))}
            </List>
          </Box>
          
          <Box display="flex" flexDirection="column" sx={{ gridColumn: 'span 4', gap: '1rem' }}>
            <Box>
              <Typography variant="h6" fontWeight={550}>Name Your Crew</Typography>
              <TextField
                id="crew-name"
                type="text"
                fullWidth
                variant="outlined"
                size="small"
                value={crewName}
                onChange={handleCrewNameChange}
                placeholder="Concrete Crew"
                required
              />
            </Box>

            <Box>
              <Typography variant="h6" fontWeight={550}>Crew Lead</Typography>
              <Typography variant="body1">
                {crewLead ? contractors?.find(contractor => contractor._id === crewLead)?.name : 'No Crew Lead Selected'}
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" fontWeight={550}>Crew Members</Typography>
              {contractors?.filter(contractor => crewMembers.has(contractor._id)).map(contractor => (
                <Typography key={contractor._id} variant="body1">
                  {contractor.name}
                </Typography>
              ))}
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="info" disabled={isCreatingCrew || !crewName || !crewLead}>Create</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddCrew;

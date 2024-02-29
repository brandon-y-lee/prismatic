import React, { useState } from 'react';
import {
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Box, 
  Tabs, 
  Tab
} from "@mui/material";
import GeneralTab from './GeneralTab';
import MemberTab from './MemberTab';

const AddTeamMember = ({ open, onClose, teamMembers }) => {
  const [activeTab, setActiveTab] = useState(1);
  const [email, setEmail] = useState('');

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = () => {
    onClose();
  };


  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: '550' }}>Add Team Member</DialogTitle>
      <DialogContent>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={activeTab}
            onChange={handleTabChange}
            aria-label="add-team-member-tabs"
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
            <Tab label="General" />
            <Tab label="Members" />
          </Tabs>
        </Box>
        {activeTab === 0 && <GeneralTab teamMembers={teamMembers} />}
        {activeTab === 1 && <MemberTab onClose={onClose} teamMembers={teamMembers} />}
      </DialogContent>
    </Dialog>
  );
};

function stringAvatar(name) {
  return {
    children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
  };
}

export default AddTeamMember;

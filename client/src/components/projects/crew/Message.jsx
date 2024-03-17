import React, { useState, useEffect, useRef } from 'react';
import { Box, Paper, Typography, Avatar, IconButton, TextField, Dialog, DialogTitle, DialogContent } from '@mui/material';
import { GroupAddOutlined, GroupOutlined, Close, UnfoldMore } from '@mui/icons-material';
import Thread from './Thread';
import { useReplyMessageMutation } from 'state/api';
import { stringAvatar, formatDate } from 'utils/project';
import { getLoggedInUser } from 'utils/token';

const Message = ({ message, onReply }) => {
  const user = getLoggedInUser();
  const recipientNames = message?.recipients.map(recipient => recipient.name);
  const collaborators = [user.name, ...recipientNames];

  const messageEndRef = useRef(null);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [message.content]);

  const [openDialog, setOpenDialog] = useState(false);
  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const [replyContent, setReplyContent] = useState()
  const [replyMessage, { isLoading: isReplyLoading }] = useReplyMessageMutation();

  const handleReplySubmit = async () => {
    if (!replyContent.trim()) return;

    try {
      await replyMessage({
        projectId: message.project_id,
        crewId: message.crew_id._id,
        senderId: user.userId,
        recipients: message.recipients.map(recipient => recipient._id),
        subject: message.subject,
        content: replyContent,
        threadId: message.thread_id,
        parentMessageId: message._id
      }).unwrap();

      console.log('Reply created successfully.');
      setReplyContent('');
    } catch (error) {
      console.error('Failed to send reply:', error);
    }
  };

  return (
    <Paper
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gridColumn: 'span 6',
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
      {/* Top Section */}
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <GroupOutlined />
            <Typography fontWeight={550}>{message.crew_id.name}</Typography>
          </Box>
          <IconButton aria-label="more" onClick={handleOpenDialog}>
            <UnfoldMore />
          </IconButton>
        </Box>
          
        {/* Title Section */}
        <Box sx={{ py: 1 }}>
          <Typography variant='h4' fontWeight={550} gutterBottom>
            {message.subject}
          </Typography>
          <Typography variant='subtitle1'>
            {message.parent_message_id 
              ? `Latest reply by ${message.sender.name} on ${formatDate(message.message_date)}` 
              : `Created by ${message.sender.name} on ${formatDate(message.message_date)}`}
          </Typography>
        </Box>

        {/* Body Section */}
        <Box sx={{ pl: 1, py: 1.5, maxHeight: '150px', overflowY: 'auto' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar {...stringAvatar(message.sender.name)} />
            <Typography variant='h6' fontWeight={550}>
              {message.sender.name}
            </Typography>
          </Box>
          <Typography variant='body1' gutterBottom sx={{ pl: '3.25rem', pb: '1rem' }}>
            {message.content}
          </Typography>
          <div ref={messageEndRef} />
        </Box>
      </Box>

      {/* Bottom Section */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ alignItems: 'center' }}>
          <TextField
            fullWidth
            placeholder="Reply to message..."
            variant="outlined"
            size="small"
            multiline
            rows={4}
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleReplySubmit();
              }
            }}
          />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
          <Typography variant='body1' sx={{ color: 'grey' }}>Collaborators</Typography>
          {collaborators.map((name, index) => (
            <Avatar key={index} {...stringAvatar(name)} sx={{ width: 24, height: 24, fontSize: '0.75rem', ...stringAvatar(name).sx }} />
          ))}
          <IconButton aria-label="add collaborators" size="small">
            <GroupAddOutlined />
          </IconButton>
        </Box>
      </Box>

      <Thread threadId={message.thread_id} open={openDialog} onClose={handleCloseDialog} />
    </Paper>
  );
};

export default Message;
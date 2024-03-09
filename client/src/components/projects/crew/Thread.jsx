import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogTitle, DialogContent, Box, Avatar, IconButton, Typography, CircularProgress, TextField } from '@mui/material';
import { Close } from '@mui/icons-material';
import { useGetMessageThreadQuery } from 'state/api';
import { stringAvatar, formatDate } from 'utils/project';

const Thread = ({ threadId, open, onClose }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const scrollRef = useRef(null);

  const { data: messages, isLoading: isMessagesLoading } = useGetMessageThreadQuery({ threadId }, { skip: !threadId || !open });

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleScrollIntoView = () => {
    scrollRef.current && scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    handleCloseMenu();
  };

  const handleScrollToBeginning = () => {
    scrollRef.current && scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    handleCloseMenu();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      scroll="paper"
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      fullWidth
      maxWidth="md"
    >
      <DialogTitle id="scroll-dialog-title">
        Message Thread
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers={true} ref={scrollRef}>
        {isMessagesLoading ? (
          <CircularProgress />
        ) : (
          messages?.map((message, index) => (
            <Box key={index} sx={{ px: 1, py: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar {...stringAvatar(message.sender)} />
                <Typography variant='h6' fontWeight={550}>
                  {message.sender}
                </Typography>
                <Typography variant='caption' sx={{ color: 'text.secondary' }}>
                  {formatDate(message.message_date)}
                </Typography>
              </Box>
              <Typography variant='body1' gutterBottom sx={{ pl: '3.25rem' }}>
                {message.content}
              </Typography>
              {/* Add styling or additional elements as necessary */}
            </Box>
          ))
        )}

        <Box sx={{ alignItems: 'center' }}>
          <TextField
            fullWidth
            placeholder="Reply to message..."
            variant="outlined"
            size="small"
            multiline
            rows={4}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default Thread;
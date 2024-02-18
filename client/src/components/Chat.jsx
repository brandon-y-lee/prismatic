import React, { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogTitle, TextField, InputAdornment, IconButton, CircularProgress, Avatar, Typography } from '@mui/material';
import { useInteractWithAssistantMutation } from 'state/api';
import { AccountCircle, Send } from '@mui/icons-material';

const Chat = ({ open, onClose }) => {
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([]);
  const [interactWithAssistant, { isLoading }] = useInteractWithAssistantMutation();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [conversation]);

  const handleSend = async () => {
    if (!message.trim()) return;
  
    const userMessage = { role: 'user', content: message };
    setConversation([...conversation, userMessage]);
    setMessage('');
  
    try {
      const response = await interactWithAssistant({ userMessage: message }).unwrap();
      console.log('assistant response.messages: ', response.messages);
      setConversation(conversation => [
        ...conversation,
        ...response.messages.filter(m => m.role === 'assistant').map(m => ({
          role: m.role,
          content: typeof m.content === 'object' ? m.content.value : m.content,
        })),
      ]);
    } catch (error) {
      console.error('Error interacting with assistant: ', error.message);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (message.split('\n').length < 8) {
        handleSend();
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle variant='h4' sx={{ fontWeight: '500' }}>
        FinanceGPT
      </DialogTitle>
      <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', maxHeight: '80vh' }}>
        {conversation.length > 0 ? (
          <div style={{ overflowY: 'auto', flexGrow: 1 }}>
            {conversation.map((msg, index) => (
              <div key={index} style={{ marginTop: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                  <Avatar sx={{ width: 24, height: 24, marginRight: '8px' }}>
                    <AccountCircle fontSize='small' />
                  </Avatar>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                    {msg.role === 'user' ? 'You' : 'FinanceGPT'}
                  </Typography>
                </div>
                <Typography variant="body1" sx={{ mx: '32px', mb: '20px' }}>
                  {msg.content}
                </Typography>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div style={{ height: '75%%' }}>
            {/* Placeholder or additional content when no conversation */}
          </div>
        )}

        <TextField
          label='Message FinanceGPT...'
          multiline
          minRows={1}
          maxRows={8}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          variant='outlined'
          disabled={isLoading}
          onKeyDown={handleKeyDown}
          sx={{ mt: '10px' }}
          InputProps={{
            sx: { borderRadius: '25px' },
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleSend}
                  disabled={isLoading || !message.trim()}
                  sx={{ bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' }, borderRadius: '12px' }}
                >
                  {isLoading ? <CircularProgress size={24} /> : <Send sx={{ color: 'common.white' }} />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default Chat;

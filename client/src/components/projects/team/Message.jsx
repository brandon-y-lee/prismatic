import React from 'react';
import { Box, Paper, Typography, Avatar, IconButton, TextField } from '@mui/material';
import { GroupAddOutlined, GroupOutlined, MoreVert } from '@mui/icons-material';

const Message = ({ team, author, title, subtitle, messageBody, onReply }) => {

  function stringToColor(string) {
    let hash = 0;
    let i;
  
    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
  
    let color = '#';
  
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */
  
    return color;
  };
  
  function stringAvatar(name) {
    return {
      sx: { bgcolor: stringToColor(name) },
      children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
    };
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
            <Typography fontWeight={550}>{team}</Typography>
          </Box>
          <IconButton aria-label="more">
            <MoreVert />
          </IconButton>
        </Box>
          
        {/* Title Section */}
        <Box sx={{ py: 1 }}>
          <Typography variant='h4' fontWeight={550} gutterBottom>
            {title}
          </Typography>
          <Typography variant='subtitle1'>
            {subtitle}
          </Typography>
        </Box>

        {/* Body Section */}
        <Box sx={{ pl: 1, py: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar {...stringAvatar(author)} />
            <Typography variant='h6' fontWeight={550}>
              {author}
            </Typography>
          </Box>
          <Typography variant='body1' gutterBottom sx={{ pl: '3.25rem', pb: '1rem' }}>
            {messageBody}
          </Typography>
        </Box>
      </Box>

      {/* Bottom Section */}
      <Box sx={{ display: 'flex', flexDirection: 'column', mt: 1, gap: 1 }}>
        <Box sx={{ alignItems: 'center' }}>
          <TextField
            fullWidth
            placeholder="Reply to message..."
            variant="outlined"
            size="small"
            multiline
            rows={3}
          />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
          <Typography variant='body1' sx={{ color: 'grey' }}>Collaborators</Typography>
          <Avatar {...stringAvatar(author)} />
          <IconButton aria-label="add collaborators" size="small">
            <GroupAddOutlined />
          </IconButton>
        </Box>
      </Box>
    </Paper>
  );
};

export default Message;
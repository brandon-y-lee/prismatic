import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Box, Typography, CircularProgress, Icon } from '@mui/material';
import { Subject } from '@mui/icons-material';
import { useInteractWithAssistantMutation } from 'state/api';

const Search = () => {
  const searchedRef = useRef(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const searchQuery = location.state?.searchQuery;
  const [conversation, setConversation] = useState([]);
  const [isLoading, setIsLoading] = useState(!id);
  const [interactWithAssistant] = useInteractWithAssistantMutation();

  const parseAssistantResponse = (response) => {
    if (typeof response !== 'string') {
      return '';
    }
  
    // Replace Markdown bold syntax with HTML <strong> tags
    let htmlResponse = response.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Replace Markdown headers ### with HTML <h3> tags
    htmlResponse = htmlResponse.replace(/^###\s*(.*)/gm, '<h3>$1</h3>');
  
    // Identify and transform numbered lists
    // Split the response into paragraphs
    const paragraphs = htmlResponse.split(/(?:\r\n|\r|\n){2,}/g);
    htmlResponse = paragraphs.map(paragraph => {
      // Check if the paragraph is a numbered list
      const listItems = paragraph.split(/(?:\r\n|\r|\n)/g);
      if (listItems.length > 1 && listItems.every(item => /^\s*\d+\.\s/.test(item))) {
        // If all items in the paragraph are list items, wrap them in <li> tags
        const listHtml = listItems.map(item => `<li>${item.replace(/^\s*\d+\.\s/, '')}</li>`).join('');
        return `<ol>${listHtml}</ol>`;
      } else {
        // If it's not a list, return the paragraph as is
        return paragraph.replace(/(?:\r\n|\r|\n)/g, '<br/>');
      }
    }).join('<br/><br/>'); // Rejoin paragraphs with two breaks
    
    // Replace unformatted bullet points with HTML list items
    htmlResponse = htmlResponse.replace(/^- (.*)/gm, '<ul><li>$1</li></ul>');

    // Clean up to avoid nested lists due to consecutive bullet points
    htmlResponse = htmlResponse.replace(/<\/ul>\s*<ul>/g, '');
  
    return htmlResponse;
  };

  useEffect(() => {
    if (searchQuery && !id && !searchedRef.current) {
      searchedRef.current = true;
      handleNewSearch(searchQuery);
    }
  }, [searchQuery, id]);

  const handleNewSearch = async (query) => {
    setIsLoading(true);
    try {
      const response = await interactWithAssistant({ userMessage: query }).unwrap();
      console.log('assistant response.messages: ', response.messages);

      const formattedMessages = response.messages.map(message => ({
        role: message.role,
        content: typeof message.content === 'object' ? message.content.value : message.content,
      }));

      // Once we have the thread ID, update the route
      navigate(`/search/${response.thread}`, {
        replace: true,
        state: { searchQuery: query, conversation: formattedMessages }
      });
    } catch (error) {
      console.error('Error interacting with assistant:', error.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Directly set the conversation from the location state if it exists
    if (location.state?.conversation) {
      setConversation(location.state.conversation.filter(m => m.role === 'assistant'));
      setIsLoading(false);
    }
  }, [location.state]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: '2rem' }}>
      <Box sx={{ display: 'flex', justifyContent: 'left' }}>
        <Typography variant="h3" gutterBottom>
          {searchQuery}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'left', gap: '0.25rem' }}>
        <Subject />
        <Typography variant="h5" gutterBottom>
          Answer
        </Typography>
      </Box>

      {conversation.map((msg, index) => {
        if (msg.role === 'assistant') {
          const messageContent = parseAssistantResponse(msg.content);
          return (
            <Typography key={index} variant="body1" sx={{ marginBottom: '1rem' }} dangerouslySetInnerHTML={{ __html: messageContent }} />
          );
        }
        return null;
      })}
    </Box>
  );
};

export default Search;

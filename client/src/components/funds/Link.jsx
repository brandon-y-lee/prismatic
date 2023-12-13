import React, { useEffect, useState } from 'react';
import { Dialog } from '@mui/material';
import { usePlaidLink } from 'react-plaid-link';
import { useExchangePublicTokenMutation, useGetLinkTokenMutation, useGetPlaidAccountsMutation } from 'state/api';
import { getLoggedInUser } from 'utils/token';

const Link = ({ isOpen, onClose, onAccountSet }) => {
  const user = getLoggedInUser();
  const [linkTokenData, setLinkTokenData] = useState(null);
  const [postLink, setPostLink] = useState(0);
  const [getLinkToken] = useGetLinkTokenMutation();
  const [exchangePublicToken] = useExchangePublicTokenMutation();
  const [getAccounts] = useGetPlaidAccountsMutation();

  useEffect(() => {
    if (isOpen && !linkTokenData) {
      const fetchLinkToken = async () => {
        try {
          const response = await getLinkToken({ userId: user.id }).unwrap();
          setLinkTokenData(response);
        } catch (error) {
          console.error('Error fetching link token:', error);
        }
      };
      fetchLinkToken();
    }
  }, [isOpen, linkTokenData, getLinkToken, user.id]);

  const { open, ready } = usePlaidLink({
    token: linkTokenData?.link_token,
    onSuccess: (public_token) => {
      console.log('Received public token:', public_token);
      try {
        const userId = user.id;
        exchangePublicToken({ public_token, userId }).then(response => {
          if (response) {
            getAccounts({ userId: userId }).then(accountsResponse => {
              console.log('Plaid Accounts:', accountsResponse);
              const accountIds = accountsResponse.data.accounts.map(account => account.account_id);
              onAccountSet(accountIds); // Pass the account IDs to Funds component
            }).catch(error => {
              console.error('Account fetch error:', error);
            });
          }
        }).catch(error => {
          console.error('Exchange token error:', error);
        });
        setPostLink(1);
      } catch (error) {
        console.error('Exchange token error:', error.message);
      }
    },
    onExit: (err, metadata) => {
      if (err) {
        console.error('Plaid Link exit error:', err);
        setPostLink(2);
      }
    },
  });

  useEffect(() => {
    if (ready && isOpen) {
      open();
    }
  }, [ready, isOpen, open]);

  useEffect(() => {
    let timeoutId;
  
    if (postLink === 1) {
      console.log('Plaid Link succeeded');
      timeoutId = setTimeout(() => {
        onClose();
        setPostLink(0);
      }, 2000);
    } else if (postLink === 2) {
      console.error('Plaid Link failed');
      timeoutId = setTimeout(() => {
        onClose();
        setPostLink(0);
      }, 2000);
    }

    return () => clearTimeout(timeoutId); // Clear timeout on cleanup
  }, [postLink, onClose]);
  
  return (
    <Dialog open={isOpen} onClose={onClose} />
  );
};

export default Link;

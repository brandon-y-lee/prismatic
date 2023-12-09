import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, Grid, Card, CardContent, CardMedia, Typography } from '@mui/material';
import { useCreateRequisitionMutation, useGetInstitutionsQuery, useListAccountsQuery } from 'state/api';
import { setLocalRequisitionId, getLocalRequisitionId } from 'utils/token';

const BankSelection = ({ isOpen, onClose, accessToken, onAccountSet }) => {
  const { data: banks } = useGetInstitutionsQuery({ accessToken });
  console.log("Banks: ", banks);

  const [requisitionId, setRequisitionId] = useState('');

  const [createRequisition] = useCreateRequisitionMutation();

  const handleBankSelect = async (institutionId) => {
    const response = await createRequisition({
      accessToken,
      institution_id: 'SANDBOXFINANCE_SFIN0000',
    });

    if (response.data && response.data.link) {
      setLocalRequisitionId(response.data.id);
      window.location.href = response.data.link;
    }
  };

  const { data: accounts, isFetching } = useListAccountsQuery({
    requisitionId,
    accessToken
  }, { skip: !requisitionId });

  useEffect(() => {
    const savedRequisitionId = getLocalRequisitionId();
    if (savedRequisitionId) {
      setRequisitionId(savedRequisitionId);
    }
  }, []);

  useEffect(() => {
    if (accounts && accounts.accounts) {
      const accountIds = accounts.accounts;
      onAccountSet(accountIds);
      console.log('Accounts: ', accountIds)
    }
  }, [accounts, onAccountSet]);


  return banks ? (
    <Dialog open={isOpen} onClose={onClose} aria-labelledby="select-bank-dialog">
      <DialogTitle id="select-bank-dialog">Select Your Bank</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          {banks.map(bank => (
            <Grid item xs={12} sm={6} md={4} key={bank.id} onClick={() => handleBankSelect(bank.id)}>
              <Card>
                <CardMedia
                  component="img"
                  height="140"
                  image={bank.logo}
                  alt={`${bank.name} logo`}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    {bank.name}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
    </Dialog>
  ) : (
    <>

    </>
  );
};

export default BankSelection;

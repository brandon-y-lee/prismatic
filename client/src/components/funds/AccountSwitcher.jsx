import { Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useContext } from 'react';
import { FundsContext } from 'context/FundsContext';

const AccountSwitcher = ({ openDialog }) => {
  const { accountIds, selectedAccount, handleAccountChange } = useContext(FundsContext);
  
  if (!accountIds.length) {
    return (
      <Button
        variant="primary"
        size="small"
        onClick={openDialog}
      >
        Connect Your Bank
      </Button>
    );
  };

  const handleAccountSelection = (event) => {
    handleAccountChange(event.target.value);
  };

  return (
    <FormControl variant="outlined" size="small">
      <InputLabel id="account-select-label">Account</InputLabel>
      <Select
        labelId="account-select-label"
        id="account-select"
        value={selectedAccount}
        label="Account"
        onChange={handleAccountSelection}
      >
        {accountIds.map((id) => (
          <MenuItem key={id} value={id}>{id}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default AccountSwitcher;
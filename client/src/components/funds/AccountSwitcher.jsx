import { Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const AccountSwitcher = ({ accountIds, selectedAccount, onAccountChange, onConnectBank }) => {
  if (!accountIds.length) {
    return (
      <Button
        variant="primary"
        size="small"
        onClick={onConnectBank}
      >
        Connect Your Bank
      </Button>
    );
  };

  const handleAccountSelection = (event) => {
    onAccountChange(event.target.value);
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
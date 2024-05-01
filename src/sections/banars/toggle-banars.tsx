'use client';

import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';

import { ToggleBanar } from 'src/actions/banars-actions';

interface IProps {
  id: string;
  is_active: boolean;
}

function ToggleBanarView({ id, is_active }: IProps) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <form action={ToggleBanar}>
        <input name="id" value={id} readOnly style={{ display: 'none' }} />
        <Switch
          checked={is_active}
          name="is_active"
          value={is_active}
          inputProps={{ 'aria-label': 'controlled' }}
          type="submit"
        />
      </form>
    </Box>
  );
}

export default ToggleBanarView;

'use client';

import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';

import { ToggleWarehouse } from 'src/actions/warehouse-actions';

interface IProps {
  id: string;
  is_active: boolean;
}

function ToggleWarehouseView({ id, is_active }: IProps) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <form action={ToggleWarehouse}>
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

export default ToggleWarehouseView;

'use client';

import { useState } from 'react';
import { useSnackbar } from 'notistack';

import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';

import { useTranslate } from 'src/locales';
import { toggleWorkArea } from 'src/actions/working-area';

interface IProps {
  id: string;
  is_active: boolean;
}

function ToggleWorkArea({ id, is_active }: IProps) {
  const [currentStatus, setStatus] = useState(is_active);
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslate();

  const swithcStatus = async (newState: boolean) => {
    const res = await toggleWorkArea(id, newState);
    if (res?.error) {
      enqueueSnackbar(res?.error, { variant: 'error' });
    } else {
      enqueueSnackbar(t('working_area_status_was_updated_successfully'));
    }
  };
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Switch
        checked={currentStatus}
        onChange={(e, checked) => {
          setStatus(checked);
          swithcStatus(checked);
        }}
      />
    </Box>
  );
}

export default ToggleWorkArea;

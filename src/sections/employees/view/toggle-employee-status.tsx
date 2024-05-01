'use client';

import { useState } from 'react';
import { toFormData } from 'axios';
import { useSnackbar } from 'notistack';

import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';

import { useTranslate } from 'src/locales';
import { patchEmployee } from 'src/actions/employees-actions';

interface IProps {
  id: string;
  is_active: boolean;
}

function ToggleEmployeeStatus({ id, is_active }: IProps) {
  const [currentStatus, setStatus] = useState(is_active);
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslate();

  const swithcStatus = async (newState: boolean) => {
    const formData = new FormData();
    toFormData({ is_active: newState }, formData);
    const res = await patchEmployee(id, formData);
    if (res?.error) {
      enqueueSnackbar(`${res?.error}`, { variant: 'error' });
    } else {
      enqueueSnackbar(t('status_has_changed_successfuly'));
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

export default ToggleEmployeeStatus;

'use client ';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { enqueueSnackbar } from 'notistack';

import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Container from '@mui/material/Container';
import { SelectChangeEvent } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';

import { useTranslate } from 'src/locales';
import { Driver } from 'src/@types/driver';
import { assignDriver } from 'src/actions/assign-driver';
import { useVerticalNavDataContext } from 'src/contexts/dashboard-vertical-bar-values';

import { useSettingsContext } from 'src/components/settings';

// ----------------------------------------------------------------------
type Props = {
  drivers: Driver[];
  shipmentId: string;
};
export default function SelectDriver({ drivers, shipmentId }: Props) {
  const settings = useSettingsContext();
  const { t } = useTranslate();
  const [driverId, setDriverId] = useState('');
  const { refresh } = useVerticalNavDataContext();
  const router = useRouter();
  const handleChange = (event: SelectChangeEvent) => {
    setDriverId(event.target.value);
  };

  const handleAssignDriver = async (id: string) => {
    const assignDriverHeaders = {
      shipmentId,
      driverId: id,
    };

    const res = await assignDriver(assignDriverHeaders);
    if (res?.error) {
      enqueueSnackbar(`${res?.error}`, { variant: 'error' });
    } else {
      enqueueSnackbar(t('Assigned successfully'));
      refresh();
      router.back();
    }
  };
  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'start',
          gap: '50px',
          py: 5,
          px: 3,
        }}
      >
        <Box>
          <Typography variant="subtitle1" sx={{ mr: '10px' }}>
            {t('Choose the driver')}
          </Typography>
        </Box>
        <Box>
          <FormControl sx={{ width: '150px' }}>
            <InputLabel id="demo-simple-select-label">{t('Driver')}</InputLabel>
            <Select defaultValue={driverId} label={t('Driver')} onChange={handleChange}>
              {drivers.map((driver: Driver) => (
                <MenuItem key={driver.user.id} value={driver.user.id}>
                  {driver.user.username}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ display: 'flex' }}>
          <Button
            disabled={!driverId}
            variant="contained"
            sx={{ px: 4 }}
            onClick={async () => {
              await handleAssignDriver(driverId);
            }}
          >
            {t('Confirm')}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

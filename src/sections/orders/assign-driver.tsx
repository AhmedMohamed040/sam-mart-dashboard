import Cookies from 'js-cookie';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { SelectChangeEvent } from '@mui/material';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import LoadingButton from '@mui/lab/LoadingButton';
import FormControl from '@mui/material/FormControl';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { useTranslate } from 'src/locales';
import { Driver } from 'src/@types/driver';
import { acceptRejectReturnOrders } from 'src/actions/accept-reject-return-orders';

import { useSnackbar } from 'src/components/snackbar';

type Props = {
  open: boolean;
  onClose: VoidFunction;
  adminNote: string;
  drivers: Driver[];
  returnedProducts?: { return_order_product_id: string; status: string }[];
  returnOrderId: string;
};

export default function AssignDriver({
  returnOrderId,
  open,
  onClose,
  adminNote,
  drivers,
  returnedProducts,
}: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslate();
  const [driverId, setDriverId] = useState('');
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');
  const handleChange = (event: SelectChangeEvent) => {
    setDriverId(event.target.value);
    setErrorMessage('');
  };
  const countAccepted =
    returnedProducts?.reduce(
      (count, item) => (item.status === 'ACCEPTED' ? count + 1 : count),
      0
    ) || 0;

  const countRejected =
    returnedProducts?.reduce(
      (count, item) => (item.status === 'REJECTED' ? count + 1 : count),
      0
    ) || 0;
  const accessToken = Cookies.get('accessToken') || '';
  const lang = Cookies.get('Language') || '';

  const handleSubmit = async () => {
    if (driverId === '') {
      setErrorMessage('Please choose a driver');
    }
    if (returnedProducts && driverId) {
      setErrorMessage('');

      const dataBody = {
        return_order_products: returnedProducts.map(({ return_order_product_id, status }) => ({
          return_order_product_id,
          status,
        })),
        status: countAccepted > countRejected ? 'ACCEPTED' : 'REJECTED',
        admin_note: adminNote,
        driver_id: driverId,
      };

      const res = await acceptRejectReturnOrders(accessToken, lang, returnOrderId, dataBody);
      if (res?.error) {
        enqueueSnackbar(`${res?.error}`, { variant: 'error' });
      } else {
        enqueueSnackbar(t('Assigned successfully'));
        onClose();
        router.push('/dashboard/returned-orders');
        router.refresh();
      }
    }
  };
  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { maxWidth: 720 },
      }}
    >
      <DialogTitle>{t(`Assign driver for the returned order`)}</DialogTitle>
      <DialogContent>
        <Box rowGap={3} columnGap={2} display="grid" mt={1}>
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
                  <MenuItem key={driver.id} value={driver.id}>
                    {driver.user.username}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box style={{ color: 'red', fontSize: '0.75rem', marginTop: '0.25rem' }}>
              {errorMessage}
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          {t('cancel')}
        </Button>

        <LoadingButton
          onClick={() => {
            handleSubmit();
          }}
          variant="contained"
          loading={false}
        >
          {t('Assign')}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

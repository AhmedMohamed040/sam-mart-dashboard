import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { getCustomNameKeyLang } from 'src/utils/helperfunction';

import { useTranslate } from 'src/locales';
import { DriverViewTableRow } from 'src/@types/dashboard-drivers';
import { assignDriverToWarehouse } from 'src/actions/drivers-dashboard-actions';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: VoidFunction;
  driver: DriverViewTableRow;
  warehouses: { [key: string]: string }[];
};

export default function AssignEditDriverWarehouse({ open, onClose, driver, warehouses }: Props) {
  const { t } = useTranslate();
  const { enqueueSnackbar } = useSnackbar();

  const defaultValues = {
    driver_id: driver.id,
    dirver_name: driver.username,
    warehouse_id: driver?.warehouse?.id || '',
  };

  const yupSchema = Yup.object().shape({
    driver_id: Yup.string().required(),
    warehouse_id: Yup.string().required(t('please_select_a_warehouse')),
  });
  const methods = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues,
    mode: 'onChange',
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    const res = await assignDriverToWarehouse(data.warehouse_id, data.driver_id);
    if (res?.error) {
      enqueueSnackbar(res.error, { variant: 'error' });
    } else {
      enqueueSnackbar(
        t(
          driver?.warehouse?.id
            ? 'driver_was_transfered_to_another_warehouse_successfully'
            : 'driver_was_assigned_to_a_warehouse_successfully'
        )
      );
      reset();
      onClose();
    }
  });

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
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle textAlign="center">{t('assign_edit_driver_warehouse')}</DialogTitle>

        <DialogContent>
          <Stack display="grid" gap={2} my={4}>
            <Box>
              <RHFTextField aria-readonly label={t('driver')} name="dirver_name" disabled />
            </Box>
            <Box>
              <RHFSelect label={t('warehouse')} name="warehouse_id">
                {warehouses.map((warehouse) => (
                  <MenuItem key={warehouse.id} value={warehouse.id}>
                    {getCustomNameKeyLang(warehouse.name_en, warehouse.name)}
                  </MenuItem>
                ))}
              </RHFSelect>
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ alignItems: 'center', justifyContent: 'center' }}>
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{
              padding: '0.75rem 2rem',
              fontSize: 12,
              fontWeight: 'bold',
            }}
          >
            {t('cancel')}
          </Button>

          <LoadingButton
            sx={{
              fontSize: 12,
              fontWeight: 'bold',
              padding: '0.75rem 2rem',
            }}
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            {t('save')}
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}

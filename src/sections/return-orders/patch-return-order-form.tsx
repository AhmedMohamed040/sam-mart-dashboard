// import { useForm } from 'react-hook-form';

import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import FormLabel from '@mui/material/FormLabel';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { useTranslate } from 'src/locales';
import { acceptOrderAndAssignDriver } from 'src/actions/return-orders-details';
import { D_ReturnOrder_Driver, D_returnOrderProducts } from 'src/@types/return-orders';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: VoidFunction;
  drivers: { id: string; username: string }[];
  products: D_returnOrderProducts[];
  currentDriver?: D_ReturnOrder_Driver;
  returnOrderId: string;
  adminNote: string | null;
};

export default function AssignEditDriverWarehouse({
  open,
  onClose,
  drivers,
  products,
  currentDriver,
  returnOrderId,
  adminNote,
}: Props) {
  const { t } = useTranslate();
  const { enqueueSnackbar } = useSnackbar();
  const defaultValues = {
    driver_id: currentDriver?.id || '',
    admin_note: adminNote || '',
  };

  const yupSchema = Yup.object().shape({
    driver_id: Yup.string().required(),
    admin_note: Yup.string(),
  });
  const methods = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues,
    mode: 'onChange',
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    const acceptAllProducts = products.map((product) => ({
      return_order_product_id: product.id,
      status: 'ACCEPTED',
    }));
    const reqBody = {
      return_order_products: acceptAllProducts,
      status: 'ACCEPTED',
      ...data,
    };
    const res = await acceptOrderAndAssignDriver(reqBody, returnOrderId);

    if (res?.error) {
      enqueueSnackbar(res.error, { variant: 'error' });
    } else {
      enqueueSnackbar(
        t(
          currentDriver?.id
            ? 'driver_was_updated_successfully'
            : 'order_was_accepted_and_driver_was_assigned_successfully'
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
        <DialogTitle textAlign="center" color="OsolColors.brown.main">
          {t('assign_edit_driver_to_the_return_order')}
        </DialogTitle>

        <DialogContent>
          <Grid container display="grid" gap={4}>
            <Grid item display="grid" gap={2}>
              <FormLabel>
                <Typography>{t('driver')}</Typography>
              </FormLabel>
              <RHFSelect
                placeholder={t('driver')}
                InputLabelProps={{ shrink: true }}
                sx={{ flexGrow: 1 }}
                name="driver_id"
              >
                {drivers.map((driver) => (
                  <MenuItem key={driver.id} value={driver.id}>
                    {driver.username}
                  </MenuItem>
                ))}
              </RHFSelect>
            </Grid>
            <Grid item display="grid" gap={2}>
              <FormLabel>
                <Typography>{t('admin_note')}</Typography>
              </FormLabel>
              <RHFTextField name="admin_note" multiline minRows={3} />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ alignItems: 'center', justifyContent: 'center' }}>
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{
              backgroundColor: 'OsolColors.brown.main',
              padding: '0.75rem 2rem',
              color: 'OsolColors.white',
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
              backgroundColor: 'OsolColors.brown.main',
              padding: '0.75rem 2rem',
              '&:disabled': {
                backgroundColor: 'OsolColors.brown.light',
                color: 'OsolColors.brown.main',
              },
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

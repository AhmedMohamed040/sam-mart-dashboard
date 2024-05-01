import * as Yup from 'yup';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { useTranslate } from 'src/locales';
import { Services } from 'src/@types/services';
import { addService, updateService } from 'src/actions/additional-services-actions';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

type Props = {
  open: boolean;
  onClose: VoidFunction;
  selectedService: Services | undefined;
};

export default function AddService({ open, onClose, selectedService }: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslate();

  const NewUserSchema = Yup.object().shape({
    name_ar: Yup.string().required(t('Name in Ar is required')),
    name_en: Yup.string().required(t('Name in En is required')),
  });

  const defaultValues = useMemo(
    () => ({
      name_ar: selectedService?.name_ar || '',
      name_en: selectedService?.name_en || '',
    }),
    [selectedService]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues: selectedService ? defaultValues : undefined,
  });

  const {
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  watch();
  const onSubmit = handleSubmit(async (data) => {
    if (selectedService) {
      const dataBody = {
        id: selectedService?.id,
        name_en: data?.name_en,
        name_ar: data?.name_ar,
      };
      const res = await updateService({ service: dataBody });
      if (res?.error) {
        enqueueSnackbar(`${res?.error}`, { variant: 'error' });
      } else {
        reset();
        onClose();
        enqueueSnackbar(t('Update success!'));
      }
    } else {
      const dataBody = {
        name_en: data?.name_en,
        name_ar: data?.name_ar,
      };

      const res = await addService({ service: dataBody });
      if (res?.error) {
        enqueueSnackbar(`${res?.error}`, { variant: 'error' });
      } else {
        reset();
        onClose();
        enqueueSnackbar(t('Added success!'));
      }
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
        <DialogTitle>
          {t(selectedService ? 'update_service' : 'add_additional_service')}
        </DialogTitle>
        <DialogContent>
          <Box rowGap={3} columnGap={2} display="grid" mt={1}>
            <RHFTextField name="name_ar" label={t('name_ar')} type="text" />

            <RHFTextField type="text" name="name_en" label={t('name_en')} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            {t('cancel')}
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            {selectedService ? t('update') : t('add')}
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}

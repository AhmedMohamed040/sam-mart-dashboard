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

import { ICity } from 'src/@types/cities';
import { useTranslate } from 'src/locales';
import { Countries } from 'src/@types/countries';
import { addCity, editCity } from 'src/actions/cities-actions';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

type Props = {
  open: boolean;
  onClose: VoidFunction;
  selectedCity: ICity | undefined;
  country: Countries;
};

export default function AddEditCity({ open, onClose, selectedCity, country }: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslate();

  const NewUserSchema = Yup.object().shape({
    name_ar: Yup.string().required(t('Name in Ar is required')),
    name_en: Yup.string().required(t('Name in En is required')),
  });

  const defaultValues = useMemo(
    () => ({
      name_ar: selectedCity?.name_ar || '',
      name_en: selectedCity?.name_en || '',
    }),
    [selectedCity]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues: selectedCity ? defaultValues : undefined,
  });

  const {
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  watch();
  const onSubmit = handleSubmit(async (data) => {
    if (selectedCity) {
      const dataBody = {
        name_en: data?.name_en,
        name_ar: data?.name_ar,
      };

      const res = await editCity({ dataBody, id: selectedCity.id, countryID: country.id });
      if (res?.error) {
        enqueueSnackbar(`${res?.error}`, { variant: 'error' });
      } else {
        enqueueSnackbar(t('Update success!'));
      }
    } else {
      const dataBody = {
        name_en: data?.name_en,
        name_ar: data?.name_ar,
      };
      const res = await addCity({ dataBody, id: country.id });
      if (res?.error) {
        enqueueSnackbar(`${res?.error}`, { variant: 'error' });
      } else {
        enqueueSnackbar(t('Added success!'));
      }
    }
    onClose();
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
        <DialogTitle>{t(selectedCity ? 'update_city' : 'add_city')}</DialogTitle>
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
            {selectedCity ? t('update') : t('add')}
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}

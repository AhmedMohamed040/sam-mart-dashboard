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
import { IRegion } from 'src/@types/regions';
import { addRegion, editRegion } from 'src/actions/region-actions';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

type Props = {
  open: boolean;
  onClose: VoidFunction;
  selectedRegion: IRegion | undefined;
  city: ICity;
};

export default function AddEditRegion({ open, onClose, selectedRegion, city }: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslate();

  const NewUserSchema = Yup.object().shape({
    name_ar: Yup.string().required(t('Name in Ar is required')),
    name_en: Yup.string().required(t('Name in En is required')),
  });

  const defaultValues = useMemo(
    () => ({
      name_ar: selectedRegion?.name_ar || '',
      name_en: selectedRegion?.name_en || '',
    }),
    [selectedRegion]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues: selectedRegion ? defaultValues : undefined,
  });

  const {
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  watch();
  const onSubmit = handleSubmit(async (data) => {
    try {
      if (selectedRegion) {
        const dataBody = {
          name_en: data?.name_en,
          name_ar: data?.name_ar,
        };

        await editRegion({ dataBody, id: selectedRegion.id, cityID: city.id });
      } else {
        const dataBody = {
          name_en: data?.name_en,
          name_ar: data?.name_ar,
          city_id: city.id,
        };
        await addRegion({ dataBody, id: city.id });
      }
      // reset();
      onClose();
      enqueueSnackbar(!selectedRegion ? 'Added success!' : 'Updated success!');
    } catch (error) {
      enqueueSnackbar(`${error?.message}`, { variant: 'error' });
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
        <DialogTitle>{t(selectedRegion ? 'update_region' : 'add_region')}</DialogTitle>
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
            {selectedRegion ? t('update') : t('add')}
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}

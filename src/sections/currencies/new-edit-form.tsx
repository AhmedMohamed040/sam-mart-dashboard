import * as Yup from 'yup';
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

// import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

interface CURRENCY {
  id: string;
  name_ar: string;
  name_en: string;
}
type Props = {
  open: boolean;
  onClose: VoidFunction;
  currency?: CURRENCY;
};

export default function NewEditCurrency({ open, onClose, currency }: Props) {
  //   const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslate();

  const yupSchema = Yup.object().shape({
    name_ar: Yup.string()
      .matches(/^[\u0600-\u06FF\s]+$/, t('only_arabic'))
      .required(t('currency_name_is_required')),
    name_en: Yup.string()
      .matches(/^[a-zA-Z\s]+$/, t('only_english'))
      .required(t('currency_name_is_required')),
  });

  const defaultValues = {
    name_ar: currency?.name_ar || '',
    name_en: currency?.name_en || '',
  };
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
    reset();
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
        <DialogTitle>{t(currency ? 'edit_currency' : 'add_new_currency')}</DialogTitle>
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
            {currency ? t('update') : t('add')}
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}

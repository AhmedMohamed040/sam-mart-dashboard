import * as Yup from 'yup';
import { useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useLocales, useTranslate } from 'src/locales';
import { addProductPrice } from 'src/actions/sub-categories-actions';

import Iconify from 'src/components/iconify';
import FormProvider from 'src/components/hook-form/form-provider';
import RHFTextField from 'src/components/hook-form/rhf-text-field-form';

interface IProps {
  price: number;
  product_sub_category_id: string;
  product_measurement_id: string;
  min_order_quantity: number;
  max_order_quantity: number;
  onClose?: () => void;
}

function SinglePriceForm({
  price,
  min_order_quantity,
  max_order_quantity,
  product_sub_category_id,
  product_measurement_id,
  onClose,
}: IProps) {
  const { currentLang } = useLocales();
  const { t } = useTranslate();
  const { enqueueSnackbar } = useSnackbar();

  const PriceSchema = Yup.object().shape({
    price: Yup.number()
      .typeError(t('should_be_a_number'))
      .required(t('price_is_required'))
      .positive(t('should_be_positive'))
      .moreThan(0, t('must_be_greater_than_zero')),
    min_order_quantity: Yup.number()
      .typeError(t('should_be_a_number'))
      .required(t('min_order_is_required'))
      .positive(t('should_be_positive'))
      .moreThan(0, t('must_be_greater_than_zero')),
    max_order_quantity: Yup.number()
      .typeError(t('should_be_a_number'))
      .required(t('max_order_is_required'))
      .positive(t('should_be_positive'))
      .moreThan(0, t('must_be_greater_than_zero')),
  });
  const methods = useForm({
    resolver: yupResolver(PriceSchema),
  });
  const {
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    setValue('min_order_quantity', min_order_quantity);
    setValue('price', price);
    setValue('max_order_quantity', max_order_quantity);
  }, [max_order_quantity, min_order_quantity, price, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    const res = await addProductPrice({ product_measurement_id, product_sub_category_id, ...data });
    if (res?.error) {
      enqueueSnackbar(`${res?.error}`, { variant: 'error' });
    } else {
      enqueueSnackbar(t('Update success!'));
    }
  });
  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={2} gap={4}>
        <Grid item xs={12}>
          <RHFTextField
            name="price"
            label={t('Price')}
            placeholder="0.00"
            type="number"
            InputLabelProps={{ shrink: true }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Box component="span" sx={{ color: 'text.disabled' }}>
                    {currentLang.value === 'en' ? (
                      'YER'
                    ) : (
                      <Iconify mt={1.3} icon="mdi:currency-riyal" />
                    )}
                  </Box>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <RHFTextField
            name="min_order_quantity"
            label={t('Min order quantity')}
            placeholder="0.00"
            type="number"
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12}>
          <RHFTextField
            name="max_order_quantity"
            label={t('Max order quantity')}
            placeholder="0.00"
            type="number"
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={12}>
          <Stack alignItems="flex-end">
            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              {t('Save')}
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

export default SinglePriceForm;

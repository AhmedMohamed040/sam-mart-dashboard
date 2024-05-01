import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useBoolean } from 'src/hooks/use-boolean';

import { getNameKeyLang } from 'src/utils/helperfunction';

import { Services } from 'src/@types/services';
import { useLocales, useTranslate } from 'src/locales';
import { ProductAdditionalService } from 'src/@types/products';
import { addServices, deleteService } from 'src/actions/sub-categories-actions';

import { RHFSelect } from 'src/components/hook-form';
import Iconify from 'src/components/iconify/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import FormProvider from 'src/components/hook-form/form-provider';
import RHFTextField from 'src/components/hook-form/rhf-text-field-form';

interface IProps {
  price: number;
  product_sub_category_id: string;
  product_measurement_id: string;
  services: Services[];
  restServices: Services[];
  additional_service_id: string;
  RemoveService: (additional_service_id: string) => void;
  AddService: (service: ProductAdditionalService) => void;
  product_additional_service_id: string;
}

function SingleServiceForm({
  price,
  services,
  restServices,
  product_sub_category_id,
  product_measurement_id,
  additional_service_id,
  product_additional_service_id,
  RemoveService,
  AddService,
}: IProps) {
  const { currentLang } = useLocales();
  const { t } = useTranslate();
  const { enqueueSnackbar } = useSnackbar();
  const confirm = useBoolean();
  const PriceSchema = Yup.object().shape({
    price: Yup.number()
      .min(1, t('Price should be non zero number'))
      .required(t('Price is required')),
    additional_service_id: Yup.string().required(t('additional service roles is required')),
  });
  const defaultValues = useMemo(
    () => ({
      price: price || 0,
      additional_service_id: additional_service_id || '',
    }),
    [additional_service_id, price]
  );
  const methods = useForm({
    resolver: yupResolver(PriceSchema),
    defaultValues,
  });
  const {
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    setValue('price', price);
    setValue('additional_service_id', additional_service_id);
  }, [additional_service_id, price, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    const res = await addServices({
      product_measurement_id,
      product_sub_category_id,
      additional_service_id: data?.additional_service_id,
      price: data?.price,
    });
    if (res?.error) {
      enqueueSnackbar(`${res?.error}`, { variant: 'error' });
    } else {
      enqueueSnackbar(t('Update success!'));
      if (product_additional_service_id === '') {
        AddService({
          additional_service: {
            name_ar: '',
            name_en: '',
            additional_service_id: res?.additional_service_id,
          },
          price: res?.price,
          product_additional_service_id: res?.id,
        });
      }
    }
  });
  const handleConfirmDelete = async () => {
    if (typeof product_additional_service_id === 'string') {
      const res = await deleteService(product_additional_service_id);
      if (res?.error) {
        enqueueSnackbar(`${res?.error}`, { variant: 'error' });
      } else {
        enqueueSnackbar(t('Deleted success!'), { variant: 'success' });
        RemoveService(res?.additional_service_id);
        confirm.onFalse();
      }
    }
  };
  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container columnSpacing={5} rowSpacing={2}>
        <Grid item xs={12}>
          <RHFSelect
            fullWidth
            disabled={!(additional_service_id === '')}
            placeholder={t('additional service ')}
            name="additional_service_id"
            label={t('additional service')}
            PaperPropsSx={{ textTransform: 'capitalize' }}
            sx={{ flexGrow: '1' }}
            autoFocus={additional_service_id === ''}
          >
            {!(additional_service_id === '')
              ? services.map((service) => (
                  <MenuItem key={service.id} value={service.id}>
                    {service[getNameKeyLang()]}
                  </MenuItem>
                ))
              : restServices.map((service) => (
                  <MenuItem key={service.id} value={service.id}>
                    {service[getNameKeyLang()]}
                  </MenuItem>
                ))}
          </RHFSelect>
        </Grid>
        <Grid item xs={12}>
          <RHFTextField
            name="price"
            label={t('Price')}
            placeholder="0.00"
            type="number"
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: '100%', flexGrow: '1' }}
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
          <Stack justifyContent="flex-end" flexDirection="row" gap={1}>
            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              {t('Save')}
            </LoadingButton>
            <Button
              variant="contained"
              color="error"
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '17px',
              }}
              onClick={() => {
                if (product_additional_service_id === '') {
                  RemoveService('');
                  return;
                }
                confirm.onTrue();
              }}
            >
              <Iconify icon="solar:trash-bin-trash-bold" width={24} />
            </Button>
          </Stack>
          <ConfirmDialog
            open={confirm.value}
            onClose={confirm.onFalse}
            title={t('delete')}
            content={t('delete_confirm')}
            action={
              <Button variant="contained" color="error" onClick={handleConfirmDelete}>
                {t('delete')}
              </Button>
            }
          />
        </Grid>
      </Grid>
    </FormProvider>
  );
}

export default SingleServiceForm;

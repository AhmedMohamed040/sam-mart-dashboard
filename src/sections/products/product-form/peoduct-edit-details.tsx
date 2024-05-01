import * as Yup from 'yup';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { yupResolver } from '@hookform/resolvers/yup';

import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';

import { useTranslate } from 'src/locales';
import { Product } from 'src/@types/products';
import { editProductDetails } from 'src/actions/product-actions';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField, RHFRadioGroup } from 'src/components/hook-form';

// ----------------------------------------------------------------------
export interface IProductForm {
  id?: string;
  name_ar: string;
  name_en: string;
  description_ar?: string;
  description_en?: string;
  is_active: boolean;
  is_recovered: boolean;
  product_images: ProductImage[];
  measurements: Measurement[];
}

export interface ProductImage {
  url: string;
  is_logo: boolean;
}

export interface Measurement {
  conversion_factor: number;
  measurement_unit_id: string;
  is_main_unit: boolean;
}

type Props = {
  productDetails?: Product;
};
interface IDataBody {
  name_ar: string;
  name_en: string;
  barcode: string;
  description_ar?: string;
  description_en?: string;
  is_active: boolean;
  is_recovered: boolean;
}

export default function ProductEditDetails({ productDetails: product }: Props) {
  const { t } = useTranslate();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const SectionSchema = Yup.object().shape({
    name_ar: Yup.string().required(t('Name in Arabic is required')),
    name_en: Yup.string().required(t('Name in English is required')),
    barcode: Yup.string().required(t('Barcode is required')),
    description_ar: Yup.string(),
    description_en: Yup.string(),
    is_recovered: Yup.boolean().required(t('this is required')),
    is_active: Yup.boolean().required(t('this is required')),
  });

  const defaultValues = useMemo(
    () => ({
      name_ar: product?.name_ar || '',
      name_en: product?.name_en || '',
      barcode: product?.product_barcode || '',
      is_active: product?.product_is_active || false,
      is_recovered: product?.product_is_recovered || false,
      description_ar: product?.product_description_ar || '',
      description_en: product?.product_description_en || '',
    }),
    [product]
  );

  const methods = useForm({
    resolver: yupResolver(SectionSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    const dataBody: IDataBody = {
      name_ar: data.name_ar,
      name_en: data.name_en,
      barcode: data.barcode,
      description_ar: data.description_ar,
      description_en: data.description_en,
      is_active: data.is_active,
      is_recovered: data.is_recovered,
    };

    const res = await editProductDetails({ dataBody, productId: product?.product_id as string });
    if (res?.error) {
      enqueueSnackbar(`${res?.error}`, { variant: 'error' });
    } else {
      enqueueSnackbar(t('Update success!'));
      router.back();
    }
  });
  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ p: 3 }}>
            <Grid container rowSpacing={3} columnSpacing={2}>
              <Grid item xs={12} sm={6}>
                <RHFTextField name="name_ar" label={t('Name in Arabic')} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <RHFTextField name="name_en" label={t('Name in English')} />
              </Grid>
              <Grid item xs={12}>
                <RHFTextField name="barcode" label={t('Product Code')} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <RHFTextField
                  name="description_ar"
                  rows={3}
                  multiline
                  label={t('Description in Arabic')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <RHFTextField
                  name="description_en"
                  rows={3}
                  multiline
                  label={t('Description in English')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <RHFRadioGroup
                  row
                  name="is_active"
                  options={[
                    { label: t('Active'), value: true },
                    { label: t('inactive'), value: false },
                  ]}
                  defaultValue={product?.product_is_active}
                  label={t('state')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <RHFRadioGroup
                  row
                  name="is_recovered"
                  options={[
                    { label: t('yes'), value: true },
                    { label: t('no'), value: false },
                  ]}
                  defaultValue={product?.product_is_recovered}
                  label={t('is_recovered')}
                />
              </Grid>
            </Grid>
            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!product ? t('add') : t('save')}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

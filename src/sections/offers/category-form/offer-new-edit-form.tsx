import * as Yup from 'yup';
import { t } from 'i18next';
import { useMemo } from 'react';
import { toFormData } from 'axios';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import FormProvider, { RHFTextField, RHFRadioGroup } from 'src/components/hook-form';
import CutomAutocompleteView from 'src/components/AutoComplete/CutomAutocompleteView';

// ----------------------------------------------------------------------
export type IOfferForm = {
  id: string;
  name_ar: string;
  name_en: string;
  logo: string;
};

export default function CategoryForm({ offer }: { offer?: IOfferForm }) {
  const router = useRouter();

  const schema = Yup.object().shape({
    name_ar: Yup.string().required(t('Name in Arabic is required')),
    name_en: Yup.string().required(t('Name in English is required')),
    logo: Yup.mixed<any>().nullable().required(t('Avatar is required')),
  });

  const defaultValues = useMemo(
    () => ({
      name_ar: offer?.name_ar ?? '',
      name_en: offer?.name_en ?? '',
      logo: offer?.logo ?? null,
    }),
    [offer]
  );

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    const formData = new FormData();
    toFormData(data, formData);

    // if (offer) {
    //   formData.set('id', offer?.id);
    //   const res = await editCategory(formData, access_token);
    //   if (res?.error) {
    //     enqueueSnackbar(`${res?.error}`, { variant: 'error' });
    //   } else {
    //     enqueueSnackbar(t('Update success!'));
    //   }
    // } else {
    //   const res = await addCategory(formData, access_token);
    //   if (res?.error) {
    //     enqueueSnackbar(`${res?.error}`, { variant: 'error' });
    //   } else {
    //     enqueueSnackbar(t('Added success!'));
    //   }
    // }
    router.push(paths.dashboard.offers);
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Card sx={{ p: 3, ml: 3, mb: 1 }}>
        <Grid container spacing={2}>
          {/* Col One */}
          <Grid item xs={12} md={6}>
            <Stack spacing={2}>
              <RHFTextField
                fullWidth
                name="product"
                label={t('product')}
                placeholder={t('product')}
              />
              <CutomAutocompleteView
                items={[]}
                label={t('unit')}
                placeholder={t('unit')}
                name="unit"
              />
              <CutomAutocompleteView
                items={[]}
                label={t('discount_type')}
                placeholder={t('discount_type')}
                name="discountType"
              />
              <RHFTextField
                fullWidth
                name="discountValue"
                label={t('percentage_or_value')}
                placeholder={t('percentage_or_value')}
              />
              <RHFTextField
                fullWidth
                name="quantity"
                label={t('quantity')}
                placeholder={t('quantity')}
              />
            </Stack>
          </Grid>

          {/* Col Two */}
          <Grid item xs={12} md={6}>
            <Stack spacing={2}>
              {/* Date */}
              {/* Date */}
              <RHFRadioGroup
                row
                name="is_active"
                options={[
                  { label: t('Active'), value: true },
                  { label: t('Disabled'), value: false },
                ]}
                label={t('state')}
              />
            </Stack>
          </Grid>
        </Grid>

        {/* Submit Button */}
        <Box width="fit-content" marginInlineStart="auto" sx={{ mt: 3 }}>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            {!offer ? t('add') : t('edit')}
          </LoadingButton>
        </Box>
      </Card>
    </FormProvider>
  );
}

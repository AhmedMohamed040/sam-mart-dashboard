import * as Yup from 'yup';
import { t } from 'i18next';
import { toFormData } from 'axios';
import { useForm } from 'react-hook-form';
import { useMemo, useCallback } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import { fData } from 'src/utils/format-number';

import { useLocales } from 'src/locales';
import { AddSection, EditSection } from 'src/actions/sections-actions';

import Iconify from 'src/components/iconify/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFSelect,
  RHFTextField,
  RHFRadioGroup,
  RHFUploadAvatar,
} from 'src/components/hook-form';

// ----------------------------------------------------------------------
export type ISectionForm = {
  id: string;
  name_ar: string;
  name_en: string;
  order_by: number;
  min_order_price: number;
  delivery_price: number;
  delivery_type: 'FAST' | 'SCHEDULED' | 'SCHEDULED&FACT';
  allowed_roles: 'CLIENT' | 'RESTURANT';
  logo: string;
  is_active: boolean;
};

type Props = {
  section?: ISectionForm;
};

const allowedRoles = [
  { value: 'CLIENT', label: t('client') },
  { value: 'RESTAURANT', label: t('restaurant') },
];
export default function SectionForm({ section }: Props) {
  const { currentLang } = useLocales();
  const deliveryType = [
    { value: 'FAST', label: t('fast delivery') },
    { value: 'SCHEDULED', label: t('scheduled delivery') },
    { value: 'SCHEDULED&FAST', label: t('scheduled & fast delivery') },
  ];
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const SectionSchema = Yup.object().shape({
    name_ar: Yup.string().required(t('Name in Arabic is required')),
    name_en: Yup.string().required(t('Name in English is required')),
    order_by: Yup.number().required(t('order is required')),
    min_order_price: Yup.number().required(t('min order price is required')),
    delivery_price: Yup.number().required(t('delivery price is required')),
    delivery_type: Yup.string().required(t('delivery type is required')),
    allowed_roles: Yup.string().required(t('allowed roles is required')),
    logo: Yup.mixed<any>().nullable().required(t('Avatar is required')),
    is_active: Yup.boolean(),
  });

  const defaultValues = useMemo(
    () => ({
      name_ar: section?.name_ar || '',
      name_en: section?.name_en || '',
      order_by: section?.order_by || 0,
      min_order_price: section?.min_order_price || 0,
      delivery_price: section?.delivery_price || 0,
      delivery_type: section?.delivery_type || '',
      logo: section?.logo || null,
      allowed_roles: section?.allowed_roles[0] || '',
      is_active: section?.is_active || false,
    }),
    [section]
  );

  const methods = useForm({
    resolver: yupResolver(SectionSchema),
    defaultValues,
  });

  const {
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  watch();

  const onSubmit = handleSubmit(async (data) => {
    const formData = new FormData();
    toFormData(data, formData);

    if (section) {
      formData.set('id', section?.id);
      const res = await EditSection(formData);
      if (res?.error) {
        enqueueSnackbar(`${res?.error}`, { variant: 'error' });
      } else {
        enqueueSnackbar(t('Update success!'));
      }
    } else {
      const res = await AddSection(formData);
      if (res?.error) {
        enqueueSnackbar(`${res?.error}`, { variant: 'error' });
      } else {
        enqueueSnackbar(t('Added success!'));
      }
    }
    router.back();
  });

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('logo', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ pt: 10, pb: 5, px: 3 }}>
            <Box sx={{ mb: 5 }}>
              <RHFUploadAvatar
                name="logo"
                maxSize={3145728}
                onDrop={handleDrop}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 3,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.disabled',
                    }}
                  >
                    {`${t('allowed')} *.jpeg, *.jpg, *.png, *.gif`}
                    <br /> {`${t('max_size')}  ${fData(3145728)}`}
                  </Typography>
                }
              />
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="name_ar" label={t('Name in Arabic')} />
              <RHFTextField name="name_en" label={t('Name in English')} />
              <RHFTextField
                name="order_by"
                label={t('Order by')}
                placeholder="0"
                type="number"
                InputLabelProps={{ shrink: true }}
              />
              <RHFTextField
                name="delivery_price"
                label={t('delivery price')}
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
                          <Iconify mt={1.2} icon="mdi:currency-riyal" />
                        )}
                      </Box>
                    </InputAdornment>
                  ),
                }}
              />
              <RHFTextField
                name="min_order_price"
                label={t('min order price')}
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
                          <Iconify mt={1.2} icon="mdi:currency-riyal" />
                        )}
                      </Box>
                    </InputAdornment>
                  ),
                }}
              />

              <RHFSelect
                fullWidth
                name="allowed_roles"
                label={t('allowed roles')}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {allowedRoles.map((option: { value: string; label: string }, index: number) => (
                  <MenuItem key={index} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFRadioGroup
                row
                name="delivery_type"
                options={deliveryType}
                label={t('Delivery type')}
              />

              {section && (
                <RHFRadioGroup
                  row
                  name="is_active"
                  label={t('is active')}
                  options={[
                    { label: t('Active'), value: true },
                    { label: t('inactive'), value: false },
                  ]}
                />
              )}
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!section ? t('add') : t('edit')}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

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
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { useRouter } from 'src/routes/hooks';

import { fData } from 'src/utils/format-number';

import { addCategory, editCategory } from 'src/actions/categories-actions';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField, RHFUploadAvatar } from 'src/components/hook-form';

// ----------------------------------------------------------------------
export type ICategoryForm = {
  id: string;
  name_ar: string;
  name_en: string;
  logo: string;
};

type Props = {
  category?: ICategoryForm;
};

export default function CategoryForm({ category }: Readonly<Props>) {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const CategorySchema = Yup.object().shape({
    name_ar: Yup.string().required(t('Name in Arabic is required')),
    name_en: Yup.string().required(t('Name in English is required')),
    logo: Yup.mixed<any>().nullable().required(t('Avatar is required')),
  });

  const defaultValues = useMemo(
    () => ({
      name_ar: category?.name_ar ?? '',
      name_en: category?.name_en ?? '',
      logo: category?.logo ?? null,
    }),
    [category]
  );

  const methods = useForm({
    resolver: yupResolver(CategorySchema),
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    const formData = new FormData();
    toFormData(data, formData);

    if (category) {
      formData.set('id', category?.id);
      const res = await editCategory(formData);
      if (res?.error) {
        enqueueSnackbar(`${res?.error}`, { variant: 'error' });
      } else {
        enqueueSnackbar(t('Update success!'));
      }
    } else {
      const res = await addCategory(formData);
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

        <Grid item xs={12} md={8} sx={{ marginY: 'auto' }}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
              }}
            >
              <RHFTextField name="name_ar" label={t('Name in Arabic')} />
              <RHFTextField name="name_en" label={t('Name in English')} />
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!category ? t('add') : t('edit')}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

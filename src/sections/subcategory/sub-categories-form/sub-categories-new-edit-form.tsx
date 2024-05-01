import * as Yup from 'yup';
import { t } from 'i18next';
import { toFormData } from 'axios';
import { useForm } from 'react-hook-form';
import { useMemo, useCallback } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fData } from 'src/utils/format-number';

import { AddSubcategory, EditSubcategory } from 'src/actions/sub-categories-actions';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField, RHFUploadAvatar } from 'src/components/hook-form';

// ----------------------------------------------------------------------
export type ISubcategoryForm = {
  id: string;
  name_ar: string;
  name_en: string;
  logo: string;
};

type Props = {
  subcategory?: ISubcategoryForm;
};
export default function SubcategoryForm({ subcategory }: Props) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const SubcategorySchema = Yup.object().shape({
    name_ar: Yup.string().required('Name in Arabic is required'),
    name_en: Yup.string().required('Name in English is required'),
    logo: Yup.mixed<any>().nullable().required('Avatar is required'),
  });

  const defaultValues = useMemo(
    () => ({
      name_ar: subcategory?.name_ar || '',
      name_en: subcategory?.name_en || '',
      logo: subcategory?.logo || null,
    }),
    [subcategory]
  );

  const methods = useForm({
    resolver: yupResolver(SubcategorySchema),
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
    try {
      if (subcategory) {
        formData.set('id', subcategory?.id);
        await EditSubcategory(formData);
      } else {
        await AddSubcategory(formData);
      }
      enqueueSnackbar(subcategory ? t('Update success!') : t('Added success!'));
      router.back();
    } catch (error) {
      console.error(error);
    }
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
                sm: 'repeat(1)',
              }}
            >
              <RHFTextField name="name_ar" label={t('Name in Arabic')} />
              <RHFTextField name="name_en" label={t('Name in English')} />
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!subcategory ? t('add') : t('edit')}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

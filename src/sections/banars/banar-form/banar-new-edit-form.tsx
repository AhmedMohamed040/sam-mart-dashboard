import * as Yup from 'yup';
import { t } from 'i18next';
import { toFormData } from 'axios';
import { useMemo, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { DatePicker } from '@mui/x-date-pickers';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { useRouter } from 'src/routes/hooks';

import { fData } from 'src/utils/format-number';

import { Banar } from 'src/@types/banar';
import { addBanar, editBanar } from 'src/actions/banars-actions';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFRadioGroup, RHFUploadAvatar } from 'src/components/hook-form';

// ----------------------------------------------------------------------
export type IBanarForm = {
  id?: string;
  started_at: Date | null;
  ended_at: Date | null;
  banar: any;
  is_active: boolean | undefined;
};

type Props = {
  banar: Banar | undefined;
};

export default function BanarForm({ banar }: Readonly<Props>) {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();
  const BanarSchema = Yup.object().shape({
    started_at: Yup.date().required(t('start_date_is_required')),
    ended_at: Yup.date()
      .min(Yup.ref('started_at'), t('please_choose_start_date_first'))
      .required(t('end_date_is_required')),
    banar: Yup.mixed<any>().nullable().required(t('banner_image_is_required')),
    is_active: Yup.boolean().required(t('this_field_is_required')),
  });
  const defaultValues = useMemo(
    () => ({
      started_at: banar?.started_at ? new Date(banar.started_at) : null,
      ended_at: banar?.ended_at ? new Date(banar.ended_at) : null,
      banar: banar?.banar ?? null,
      is_active: banar?.is_active ?? true,
    }),
    [banar]
  );

  const methods = useForm({
    resolver: async (values) => {
      const dateValues = {
        ...values,
        started_at: values.started_at ? new Date(values.started_at) : null,
        ended_at: values.ended_at ? new Date(values.ended_at) : null,
      };

      try {
        await BanarSchema.validate(dateValues, { abortEarly: false });
        return {
          values: dateValues,
          errors: {},
        };
      } catch (errors) {
        return {
          values,
          errors: errors.inner.reduce(
            (allErrors: any, currentError: { path: any; message: any }) => ({
              ...allErrors,
              [currentError.path]: currentError,
            }),
            {}
          ),
        };
      }
    },
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,
    control,
    formState: { isSubmitting, errors },
  } = methods;

  const onSubmit = handleSubmit(async (data: IBanarForm) => {
    const formData = new FormData();
    toFormData(data, formData);
    if (typeof data?.banar === 'string') {
      formData.delete('banar');
    }
    if (banar) {
      formData.set('id', banar?.id);
      const res = await editBanar(formData, banar?.id);
      if (res?.error) {
        enqueueSnackbar(`${res?.error}`, { variant: 'error' });
      } else {
        enqueueSnackbar(t('Update success!'));
      }
    } else {
      const res = await addBanar(formData);
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
        setValue('banar', newFile, { shouldValidate: true });
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
                name="banar"
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
              <Controller
                name="started_at"
                control={control}
                render={({ field }) => <DatePicker {...field} label={t('Start date')} />}
              />
              {errors?.started_at && (
                <span style={{ color: '#FF5630', fontSize: '0.75rem', fontWeight: '400' }}>
                  {errors?.started_at.message}
                </span>
              )}
              <Controller
                name="ended_at"
                control={control}
                render={({ field }) => <DatePicker {...field} label={t('End date')} />}
              />
              {errors.ended_at && (
                <span style={{ color: '#FF5630', fontSize: '0.75rem', fontWeight: '400' }}>
                  {errors.ended_at.message}
                </span>
              )}
              <RHFRadioGroup
                row
                name="is_active"
                options={[
                  { label: t('Active'), value: true },
                  { label: t('Disabled'), value: false },
                ]}
                label={t('state')}
              />
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!banar ? t('add') : t('edit')}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

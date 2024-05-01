'use client';

import * as Yup from 'yup';
import { t } from 'i18next';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { getCustomNameKeyLang } from 'src/utils/helperfunction';

import { addReason, editReason } from 'src/actions/reasons-action';
import { IReason, REASON_TYPES, ROLE_OPTIONS } from 'src/@types/reasons';

import { useSettingsContext } from 'src/components/settings';
import FormProvider from 'src/components/hook-form/form-provider';
import { RHFTextField, RHFMultiCheckbox } from 'src/components/hook-form';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import CutomAutocompleteView from 'src/components/AutoComplete/CutomAutocompleteView';

interface IProps {
  reason?: IReason;
}
export default function ReasonsViewEdit({ reason }: IProps) {
  const settings = useSettingsContext();
  const ReasonSchema = Yup.object().shape({
    name_ar: Yup.string().required(t('Name in Arabic is required')),
    name_en: Yup.string().required(t('Name in English is required')),
    type: Yup.object().required(t('Type is required')),
  });
  const defaultValues = {
    name_ar: reason?.name_ar || '',
    name_en: reason?.name_en || '',
    type: reason?.type
      ? { id: reason?.type, name: reason?.type, name_ar: reason?.type, name_en: reason?.type }
      : '',
    roles: reason?.roles || '',
  };

  const methods = useForm({
    resolver: yupResolver(ReasonSchema),
    defaultValues,
  });
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const onSubmit = handleSubmit(async (data: any) => {
    if (reason) {
      const dataBody = {
        name_ar: data?.name_ar,
        name_en: data?.name_en,
        type: data?.type?.id,
        roles: data?.roles,
      };
      const res = await editReason({ reason: dataBody, id: reason.id as string });
      if (res?.error) {
        enqueueSnackbar(`${res?.error}`, { variant: 'error' });
      } else {
        enqueueSnackbar(t('Update success!'));
      }
      router.back();
    } else {
      const dataBody = {
        name_ar: data?.name_ar,
        name_en: data?.name_en,
        type: data?.type?.id,
        roles: data?.roles,
      };

      const res = await addReason({ reason: dataBody });
      if (res?.error) {
        enqueueSnackbar(`${res?.error}`, { variant: 'error' });
      } else {
        enqueueSnackbar(t('Added success!'));
      }
      router.push(paths.dashboard.reasons);
    }
  });
  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading={reason ? t('edit_reason') : t('add_reason')}
        links={[
          {
            name: t('reasons'),
            href: paths.dashboard.reasons,
          },
          {
            name: reason ? getCustomNameKeyLang(reason?.name_en, reason?.name_ar) : t('add_reason'),
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Card sx={{ p: 3 }}>
              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(2, 2fr)',
                }}
              >
                <RHFTextField name="name_ar" label={t('Name in Arabic')} type="text" />
                <RHFTextField name="name_en" label={t('Name in English')} type="text" />
                <CutomAutocompleteView
                  items={REASON_TYPES}
                  placeholder="Type"
                  name="type"
                  label="Type"
                />
                <Stack spacing={1}>
                  <Typography variant="subtitle2">{t('Roles')}</Typography>
                  <RHFMultiCheckbox row name="roles" spacing={2} options={ROLE_OPTIONS} />
                </Stack>
              </Box>
              <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  {!reason ? t('add') : t('edit')}
                </LoadingButton>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    </Container>
  );
}

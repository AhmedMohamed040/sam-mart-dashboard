'use client';

import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import LoadingButton from '@mui/lab/LoadingButton';

import { useTranslate } from 'src/locales';
import { StaticPage, patchStaticPage } from 'src/actions/static-page-actions';

import { RHFTextField } from 'src/components/hook-form';
import { useSettingsContext } from 'src/components/settings';
import FormProvider from 'src/components/hook-form/form-provider';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';

interface Props {
  type: StaticPage;
  description: {
    ar: string;
    en: string;
  };
}

export default function StaticPageView({ type, description }: Props) {
  const settings = useSettingsContext();
  const { t } = useTranslate();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const schema = Yup.object().shape({
    description_ar: Yup.string().required(t('description_is_required')),
    description_en: Yup.string().required(t('description_is_required')),
  });

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      description_ar: description.ar,
      description_en: description.en,
    },
  });
  const { handleSubmit, watch } = methods;

  const [isSubmitting, setIsSubmitting] = useState(false);

  const description_ar = watch('description_ar');
  const description_en = watch('description_en');
  const isDisabled = useMemo(
    () => description.ar === description_ar && description.en === description_en,
    [description, description_ar, description_en]
  );

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    const res = await patchStaticPage({
      static_page_type: type,
      content_ar: data.description_ar,
      content_en: data.description_en,
    });
    if (res.message === 'Success') {
      enqueueSnackbar(t('Saved successfuly!'), {
        variant: 'success',
      });
      router.refresh();
    } else {
      enqueueSnackbar(`${res?.error}`, {
        variant: 'success',
      });
    }
    setIsSubmitting(false);
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading={t(type)}
        links={[{}]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Card sx={{ p: 3, mb: 1 }}>
          <Stack spacing={3}>
            <RHFTextField
              label={t('Description in Arabic')}
              name="description_ar"
              defaultValue={description.ar}
              multiline
              rows={10}
              dir="rtl"
            />
            <RHFTextField
              label={t('Description in English')}
              name="description_en"
              defaultValue={description.en}
              multiline
              rows={10}
              dir="ltr"
            />
          </Stack>
          {/* Submit Button */}
          <Box marginInlineStart="auto" marginTop={3} width="fit-content">
            <LoadingButton
              type="submit"
              variant="contained"
              disabled={isDisabled}
              loading={isSubmitting}
            >
              {t('save')}
            </LoadingButton>
          </Box>
        </Card>
      </FormProvider>
    </Container>
  );
}

'use client';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { Banar } from 'src/@types/banar';
import { useTranslate } from 'src/locales';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import BanarForm from '../banar-new-edit-form';

// ----------------------------------------------------------------------
type Props = {
  banar?: Banar;
};

export default function BanarCreateView({ banar }: Readonly<Props>) {
  const settings = useSettingsContext();
  const { t } = useTranslate();
  const leef = banar ? 'edit' : 'new';
  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading={banar ? t('edit_banar') : t('add_banar')}
        links={[
          {
            name: t('banars'),
            href: paths.dashboard.banars,
          },
          { name: t(leef) },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <BanarForm banar={banar} />
    </Container>
  );
}

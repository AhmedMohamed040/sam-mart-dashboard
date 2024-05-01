'use client';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { getCustomNameKeyLang } from 'src/utils/helperfunction';

import { useTranslate } from 'src/locales';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import SectionForm, { ISectionForm } from '../section-new-edit-form';

// ----------------------------------------------------------------------
type Props = {
  section?: ISectionForm;
};
export default function SectionCreateView({ section }: Props) {
  const settings = useSettingsContext();
  const { t } = useTranslate();
  const leef = section ? 'edit' : 'new';
  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading={
          section
            ? getCustomNameKeyLang(section?.name_en, section?.name_ar)
            : t('Create a new section')
        }
        links={[
          {
            name: t('sections'),
            href: paths.dashboard.sections,
          },
          { name: section ? getCustomNameKeyLang(section?.name_en, section?.name_ar) : t(leef) },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <SectionForm section={section} />
    </Container>
  );
}

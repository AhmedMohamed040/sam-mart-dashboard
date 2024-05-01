'use client';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { getCustomNameKeyLang } from 'src/utils/helperfunction';

import { useTranslate } from 'src/locales';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import CategoryForm, { ICategoryForm } from '../category-new-edit-form';

// ----------------------------------------------------------------------
type Props = {
  category?: ICategoryForm;
};

export default function CategoryCreateView({ category }: Readonly<Props>) {
  const settings = useSettingsContext();
  const { t } = useTranslate();
  const leef = category ? 'edit' : 'new';

  const Links = category
    ? [
        {
          name: t('categories'),
          href: paths.dashboard.categories,
        },
        { name: getCustomNameKeyLang(category.name_en, category.name_ar) },
        { name: t(leef) },
      ]
    : [
        {
          name: t('categories'),
          href: paths.dashboard.categories,
        },
        { name: t(leef) },
      ];
  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading={
          category ? getCustomNameKeyLang(category.name_en, category.name_ar) : t('add_category')
        }
        links={Links}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <CategoryForm category={category} />
    </Container>
  );
}

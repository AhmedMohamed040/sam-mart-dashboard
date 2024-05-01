'use client';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { getCustomNameKeyLang } from 'src/utils/helperfunction';

import { useTranslate } from 'src/locales';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import SubcategoryForm, { ISubcategoryForm } from '../sub-categories-new-edit-form';

// ----------------------------------------------------------------------
type Props = {
  subcategory?: ISubcategoryForm;
};
export default function SubcategoryView({ subcategory }: Props) {
  const settings = useSettingsContext();
  const { t } = useTranslate();

  const Links = subcategory
    ? [
        {
          name: t('sub_categories'),
          href: paths.dashboard.subCategories,
        },
        { name: getCustomNameKeyLang(subcategory.name_en, subcategory.name_ar) },
        { name: t('edit') },
      ]
    : [
        {
          name: t('sub_categories'),
          href: paths.dashboard.subCategories,
        },
        { name: t('new') },
      ];
  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading={t(
          `${subcategory ? getCustomNameKeyLang(subcategory.name_en, subcategory.name_ar) : 'add_sub_category'}`
        )}
        links={Links}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <SubcategoryForm subcategory={subcategory} />
    </Container>
  );
}

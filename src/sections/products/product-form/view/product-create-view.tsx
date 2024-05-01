'use client';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';
import { Unit } from 'src/actions/units-actions';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import ProductForm, { IProductForm } from '../product-new-edit-form';

// ----------------------------------------------------------------------
type Props = {
  product?: IProductForm;
  units: Unit[];
};
export default function ProductCreateView({ product, units }: Props) {
  const settings = useSettingsContext();
  const { t } = useTranslate();
  const leef = product ? 'edit' : 'new';
  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading={product ? t('Edit Product') : t('Create a new product')}
        links={[
          {
            name: t('Products'),
            href: paths.dashboard.productsGroup.total,
          },
          { name: t(leef) },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ProductForm product={product} units={units} />
    </Container>
  );
}

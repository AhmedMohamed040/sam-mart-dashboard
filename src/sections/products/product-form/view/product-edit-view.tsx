'use client';

import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { getCustomNameKeyLang } from 'src/utils/helperfunction';

import { useTranslate } from 'src/locales';
import { Unit } from 'src/actions/units-actions';
import { ISingleProduct } from 'src/@types/products';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import ProductEditMeasure from '../product-edit-measure';
import ProductEditDetails from '../peoduct-edit-details';
import ProductEditImages from '../../Product-Edit-Images';

// ----------------------------------------------------------------------
type Props = {
  product?: ISingleProduct;
  units: Unit[];
};
export default function ProductEditView({ product, units }: Props) {
  const settings = useSettingsContext();
  const { t } = useTranslate();
  const leef = product ? 'edit' : 'new';
  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading={
          product
            ? getCustomNameKeyLang(product.product.name_en, product.product.name_ar)
            : t('Create a new product')
        }
        links={[
          {
            name: t('Products'),
            href: paths.dashboard.productsGroup.total,
          },
          {
            name: product
              ? getCustomNameKeyLang(product.product.name_en, product.product.name_ar)
              : t(leef),
          },
          {
            name: t(leef),
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Grid container spacing={1} gap={3}>
        <Grid item xs={12} md={4}>
          <ProductEditImages product={product?.product} />
        </Grid>
        <Grid item xs={12} md={7}>
          <ProductEditDetails productDetails={product?.product} />
          <ProductEditMeasure
            product_id={product?.product?.product_id ?? ''}
            product_measurements={product?.product_measurements}
            units={units}
          />
        </Grid>
      </Grid>
    </Container>
  );
}

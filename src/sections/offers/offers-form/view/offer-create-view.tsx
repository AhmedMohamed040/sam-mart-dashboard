'use client';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import OfferForm, { OfferFormProps } from '../offer-new-edit-form';

// ----------------------------------------------------------------------

export default function OfferCreateView({
  offer,
  product,
  nameSuggestions,
}: Readonly<OfferFormProps>) {
  const settings = useSettingsContext();
  const { t } = useTranslate();
  const leef = offer ? 'edit' : 'new';
  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading={offer ? t('Edit offer') : t('New offer')}
        links={[
          {
            name: t('offers'),
            href: paths.dashboard.offers,
          },
          { name: t(leef) },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <OfferForm offer={offer} product={product} nameSuggestions={nameSuggestions} />
    </Container>
  );
}

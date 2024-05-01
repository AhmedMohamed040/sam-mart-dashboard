'use client';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

export default function Header({
  userType,
  username,
}: {
  userType: 'client' | 'driver';
  username: string;
}) {
  const { t } = useTranslate();

  const DRIVERS_ROUTING = [
    {
      name: t('drivers'),
      href: paths.dashboard.drivers,
    },
    {
      name: username,
    },
  ];
  const CLIENTS_ROUTING = [
    {
      name: t('clients'),
      href: paths.dashboard.clients,
    },
    {
      name: username,
    },
  ];

  const LINKS = userType === 'driver' ? DRIVERS_ROUTING : CLIENTS_ROUTING;
  return <CustomBreadcrumbs heading={t('wallet_and_transactions')} links={LINKS} />;
}

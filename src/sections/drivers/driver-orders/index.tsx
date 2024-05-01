'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';
import { META, HANDLEDED_ORDERS_LIST } from 'src/@types/dashboard-drivers';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import DriverOrdersSearch from './search';
import DriverOrdersFilter from './filters';
import DriverOrdersTable from './order-tables';

const DriverOrdersView = ({
  orders,
  meta,
  driverName,
}: {
  orders: HANDLEDED_ORDERS_LIST[] | [];
  meta: META;
  driverName: string;
}) => {
  const { t } = useTranslate();
  return (
    <Container maxWidth="xl">
      <CustomBreadcrumbs
        heading={driverName || t('driver_orders')}
        links={[
          {
            name: t('drivers'),
            href: paths.dashboard.drivers,
          },
          {
            name: driverName || t('unknown'),
          },
        ]}
      />
      <Box sx={{ width: '500px', maxWidth: '100%', mx: 'auto' }}>
        <DriverOrdersSearch />
      </Box>
      <DriverOrdersFilter />
      <DriverOrdersTable orders={orders} meta={meta} />
    </Container>
  );
};

export default DriverOrdersView;

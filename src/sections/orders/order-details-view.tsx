'use client';

import { useState } from 'react';

import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { Driver } from 'src/@types/driver';
import { useTranslate } from 'src/locales';
import { IOrderDetails } from 'src/@types/orders';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import ClientData from 'src/sections/orders/client-data';
import OrderSummary from 'src/sections/orders/order-summary';
import OrderDetails from 'src/sections/orders/order-details';
import SelectDriver from 'src/sections/orders/select-driver';

// ----------------------------------------------------------------------

type Props = {
  order: IOrderDetails;
  cancel: any;
  broadcastOrder: any;
  drivers: Driver[];
  waitingStatus?: string;
};

export default async function OrderDetailsView({
  order,
  drivers,
  cancel,
  broadcastOrder,
  waitingStatus,
}: Props) {
  const [returnedProducts, setReturnedProducts] = useState([]);
  const { t } = useTranslate();
  //
  return (
    <Container maxWidth="xl">
      <CustomBreadcrumbs
        heading={t('order_details')}
        links={[
          {
            name: t('orders'),
            href: paths.dashboard.ordersGroup.root,
          },
          {
            name: t('order_number'),
          },
          {
            name: order.order_number,
          },
        ]}
        sx={{ mb: 4 }}
      />
      <Grid
        container
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          md: 'repeat(2, 1fr)',
        }}
        gap={4}
      >
        <Grid item>
          <OrderSummary order={order} />
        </Grid>
        <Grid item>
          <ClientData clientData={order?.user} address={order?.address} />
        </Grid>
        <Grid
          item
          gridColumn={{
            xs: 'span 1',
            md: 'span 2',
          }}
        >
          <OrderDetails
            shipments={order?.shipments.shipment_products}
            status={order?.shipments.status}
            setReturnedProducts={setReturnedProducts}
            returnedProducts={returnedProducts}
            waitingStatus={waitingStatus}
          />
        </Grid>
        {!order.shipments.driver && order?.shipments.status !== 'CANCELED' && (
          <Grid item xs={12}>
            <SelectDriver drivers={drivers} shipmentId={order.shipments.id} />
          </Grid>
        )}
      </Grid>
    </Container>
  );
}

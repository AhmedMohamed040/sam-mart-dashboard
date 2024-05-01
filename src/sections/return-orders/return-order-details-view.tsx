'use client';

// import { useRouter } from 'next/navigation';
import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { useTranslate } from 'src/locales';
import { D_returnOrder, D_returnOrderProducts } from 'src/@types/return-orders';

import { useTable } from 'src/components/table';
import SharedTable from 'src/components/shared-table';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import ReturnOrderSummary from './order-summary';
import ReturnOrderClientData from './client-data';
import PatchReturnOrderForm from './patch-return-order-form';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'barcode', label: 'barcode' },
  { id: 'product_logo', label: 'image' },
  { id: 'product_name', label: 'product name' },
  { id: 'price', label: 'Amount' },
  { id: 'quantity', label: 'quantity' },
  { id: 'total_price', label: 'Total' },
  { id: 'reason', label: 'Reason' },
];

type Props = {
  returnOrder: D_returnOrder;
  drivers: { id: string; username: string }[];
};

export default function ReturnOrderDetailsView({ returnOrder, drivers }: Props) {
  const settings = useSettingsContext();
  const formController = useBoolean();
  const table = useTable({ defaultOrderBy: 'createDate' });
  const { t } = useTranslate();
  const [filters, setFilters] = useState({ name: '' });
  const handleFilters = useCallback(
    (name: string, value: string) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const additionalTableProps = {
    onRenderbarcode: (item: D_returnOrderProducts) => item.product_barcode || '-',
    onRenderproduct_logo: (item: D_returnOrderProducts) => (
      <Avatar src={item.product_logo.url} alt={item.product_logo.url} sx={{ mr: 2 }}>
        {item.product_name.charAt(0).toUpperCase()}
      </Avatar>
    ),
    onRendertotal_price: (item: D_returnOrderProducts) => item.quantity * Number(item.price),
    onRenderreason: (item: D_returnOrderProducts) => item.returnProductReason.name,
  };

  const {
    order: { number, id: orderId },
    return_number,
    created_at,
    customer_note,
    driver,
  } = returnOrder;

  const OrderSummaryData = {
    orderId,
    number,
    return_number,
    created_at,
    customer_note,
    driver,
    quantity: returnOrder.returnOrderProducts.length,
    totalPrice: returnOrder.returnOrderProducts.reduce(
      (acc, cur) => acc + Number(cur.price) * Number(cur.quantity),
      0
    ),
  };
  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading={t('Return Requests')}
        links={[
          {
            name: t('Return Requests'),
            href: paths.dashboard.returnRequests,
          },
          {
            name: t('order_number'),
          },
          {
            name: returnOrder.return_number,
          },
        ]}
        sx={{ mb: 4 }}
      />
      <Grid
        container
        display="grid"
        gridTemplateColumns={{ xs: '1fr', md: 'repeat(2, 1fr)' }}
        gap={4}
        gridAutoRows="1fr"
      >
        <Grid item>
          <ReturnOrderSummary order={OrderSummaryData} theDriver={returnOrder?.driver} />
        </Grid>
        <Grid item>
          <ReturnOrderClientData clientData={returnOrder.order.user} />
        </Grid>
      </Grid>
      <Box mt={4}>
        <SharedTable
          dataFiltered={returnOrder.returnOrderProducts}
          count={returnOrder.returnOrderProducts.length}
          table={table}
          enableExportImport={false}
          tableHeaders={TABLE_HEAD}
          additionalTableProps={additionalTableProps}
          handleFilters={handleFilters}
          filters={filters}
          disablePagination
          actions={[]}
        />
      </Box>
      <Box my={4}>
        <Button variant="contained" onClick={formController.onTrue}>
          {returnOrder.status === 'PENDING' && t('accept_return_order')}
          {returnOrder.status === 'ACCEPTED' && t('assign_a_driver')}
        </Button>
        {formController.value && (
          <PatchReturnOrderForm
            open={formController.value}
            onClose={formController.onFalse}
            drivers={drivers}
            returnOrderId={returnOrder.id}
            products={returnOrder.returnOrderProducts}
            currentDriver={returnOrder.driver}
            adminNote={returnOrder.admin_note}
          />
        )}
      </Box>
    </Container>
  );
}

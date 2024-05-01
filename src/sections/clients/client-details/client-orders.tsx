'use client';

import { t } from 'i18next';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import { DatePicker } from '@mui/x-date-pickers';

import { paths } from 'src/routes/paths';
import { useRouter, usePathname, useSearchParams } from 'src/routes/hooks';

import { fDate } from 'src/utils/format-time';
import { getNameKeyLang } from 'src/utils/helperfunction';

import { IWarehouse } from 'src/@types/warehouse';
import { IOrder, IOrderDetails } from 'src/@types/orders';

import SharedTable from 'src/components/shared-table';
import { useSettingsContext } from 'src/components/settings';
import { useTable, getComparator } from 'src/components/table';
import FormProvider from 'src/components/hook-form/form-provider';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import CutomAutocompleteView, { ITems } from 'src/components/AutoComplete/CutomAutocompleteView';

const TABLE_HEAD = [
  { id: 'order_number', label: 'order_number' },
  { id: 'username', label: 'name' },
  { id: 'phone', label: 'phone' },
  { id: 'order_products', label: 'order_products' },
  { id: 'total_price', label: 'total_price' },
  { id: 'order_created_at', label: 'order_created_at' },
  { id: 'is_paid', label: 'is_paid' },
  { id: 'delivary_type', label: 'delivary_type' },
  { id: 'status', label: 'status' },
  { id: 'payment_method', label: 'payment_method' },
  { id: 'driver', label: 'driver' },
  { id: 'warehouse', label: 'warehouse' },
];
const payment_methods: ITems[] = [
  {
    id: 'CASH',
    name: getNameKeyLang() === 'name_en' ? 'CASH' : 'كاش',
    name_en: 'CASH',
    name_ar: 'كاش',
  },
  {
    id: 'ONLINE',
    name: getNameKeyLang() === 'name_en' ? 'ONLINE' : 'اونلاين',
    name_en: 'ONLINE',
    name_ar: 'اونلاين',
  },
];
const delivary_types: ITems[] = [
  {
    id: 'FAST',
    name: getNameKeyLang() === 'name_en' ? 'FAST' : 'سريع',
    name_en: 'FAST',
    name_ar: 'سريع',
  },
  {
    id: 'SCHEDULED',
    name: getNameKeyLang() === 'name_en' ? 'SCHEDULED' : 'مجدول',
    name_en: 'SCHEDULED',
    name_ar: 'مجدول',
  },
];
const order_status: ITems[] = [
  {
    id: 'ACTIVE',
    name: getNameKeyLang() === 'name_en' ? 'ACTIVE' : 'مفعل',
    name_en: 'ACTIVE',
    name_ar: 'مفعل',
  },
  {
    id: 'PENDING',
    name: getNameKeyLang() === 'name_en' ? 'PENDING' : 'قيد الموافقة',
    name_en: 'PENDING',
    name_ar: 'قيد الموافقة',
  },
  {
    id: 'CONFIRMED',
    name: getNameKeyLang() === 'name_en' ? 'CONFIRMED' : 'مؤكد',
    name_en: 'CONFIRMED',
    name_ar: 'مؤكد',
  },
  {
    id: 'PROCESSING',
    name: getNameKeyLang() === 'name_en' ? 'PROCESSING' : 'قيد التجهيز',
    name_en: 'PROCESSING',
    name_ar: 'قيد التجهيز',
  },
  {
    id: 'PICKED_UP',
    name: getNameKeyLang() === 'name_en' ? 'PICKED_UP' : 'تم التجهيز',
    name_en: 'PICKED_UP',
    name_ar: 'تم التجهيز',
  },
  {
    id: 'DELIVERED',
    name: getNameKeyLang() === 'name_en' ? 'DELIVERED' : 'تم التوصيل',
    name_en: 'DELIVERED',
    name_ar: 'تم التوصيل',
  },
  {
    id: 'COMPLETED',
    name: getNameKeyLang() === 'name_en' ? 'COMPLETED' : 'مكتمل',
    name_en: 'COMPLETED',
    name_ar: 'مكتمل',
  },
  {
    id: 'RETRUNED',
    name: getNameKeyLang() === 'name_en' ? 'RETRUNED' : 'مرتجع',
    name_en: 'RETRUNED',
    name_ar: 'مرنجع',
  },
  {
    id: 'CANCELLED',
    name: getNameKeyLang() === 'name_en' ? 'CANCELLED' : 'ملغي',
    name_en: 'CANCELLED',
    name_ar: 'ملغي',
  },
];

export function ClientOrders({
  orders,
  count,
  warehouses,
  drivers,
  clientName,
  clientId,
  DisableCards = false,
}: {
  count: number;
  orders: IOrder[];
  warehouses: IWarehouse[];
  drivers: ITems[];
  DisableCards?: boolean;
  clientId: string;
  clientName: string;
}) {
  const settings = useSettingsContext();
  const table = useTable({ defaultOrderBy: 'createDate' });
  const methods = useForm();
  const { setValue } = methods;
  const dataFiltered = applyFilter({
    inputData: orders,
    comparator: getComparator(table.order, table.orderBy),
    dateError: false,
  });
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams]
  );
  const additionalTableProps = {
    onRenderorder_number: (item: IOrder) => item?.order_number,
    onRenderusername: (item: IOrder) => item?.user?.username,
    onRenderphone: (item: IOrder) => item?.user?.phone,
    onRenderorder_products: (item: IOrder) => item?.order_products,
    onRendertotal_price: (item: IOrder) => item?.total_price,
    onRenderorder_created_at: (item: IOrder) => fDate(item?.order_created_at),
    onRenderis_paid: (item: IOrder) => t(item?.is_paid ? 'Paid' : 'Not Paid'),
    onRenderdelivary_type: (item: IOrder) => t(item?.delivery_type),
    onRenderstatus: (item: IOrder) => t(item?.shipments?.status),
    onRenderpayment_method: (item: IOrder) => t(item?.payment_method),
    onRenderdriver: (item: IOrder) => t(item?.shipments?.driver?.username ?? 'Not Assigned'),
    onRenderwarehouse: (item: IOrder) => item?.warehouse?.name,
  };
  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading={clientName}
        links={[
          {
            name: t('Clients'),
            href: paths.dashboard.clients,
          },
          {
            name: clientName,
            href: `${paths.dashboard.clients}/${clientId}`,
          },
          {
            name: t('Orders'),
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <FormProvider methods={methods}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card sx={{ p: 3, ml: 3, mb: 1 }}>
              <Box
                rowGap={1}
                columnGap={1}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(2, 1fr)',
                  sm: `repeat(${DisableCards ? 3 : 4}, 1fr)`,
                }}
                sx={{ mb: 1 }}
              >
                {!DisableCards && (
                  <CutomAutocompleteView
                    items={order_status}
                    label={t('Order Status')}
                    placeholder={t('Order Status')}
                    name="orderStatusId"
                    onCustomChange={(orderStatus: any) =>
                      createQueryString('orderStatus', orderStatus?.id ?? '')
                    }
                  />
                )}
                <CutomAutocompleteView
                  items={delivary_types}
                  label={t('Delivary Type')}
                  placeholder={t('Delivary Type')}
                  name="delivaryTypeId"
                  onCustomChange={(delivaryType: any) =>
                    createQueryString('delivaryType', delivaryType?.id ?? '')
                  }
                />
                <CutomAutocompleteView
                  items={drivers as unknown as ITems[]}
                  label={t('Driver')}
                  placeholder={t('Driver')}
                  name="DriverId"
                  onCustomChange={(Driver: any) => createQueryString('Driver', Driver?.id ?? '')}
                />
                <CutomAutocompleteView
                  items={warehouses as unknown as ITems[]}
                  label={t('warehouse')}
                  placeholder={t('warehouse')}
                  name="warehouseId"
                  onCustomChange={(warehouseId: any) =>
                    createQueryString('warehouse', warehouseId?.id ?? '')
                  }
                />
              </Box>
              :
              <Box
                rowGap={1}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(2, 1fr)',
                  sm: 'repeat(3, 1fr)',
                }}
              >
                <CutomAutocompleteView
                  items={payment_methods}
                  label={t('Paying Method')}
                  placeholder={t('Paying Method')}
                  name="payingMethodId"
                  onCustomChange={(payingMethodId: any) =>
                    createQueryString('payingMethod', payingMethodId?.id ?? '')
                  }
                />
                <CutomAutocompleteView
                  items={[
                    {
                      id: 'True',
                      name: getNameKeyLang() === 'name_en' ? 'Paid' : 'مدفوع',
                      name_ar: 'مدفوع',
                      name_en: 'Paid',
                    },
                    {
                      id: 'False',
                      name: getNameKeyLang() === 'name_en' ? 'Not Paid' : 'غير مدفوع',
                      name_ar: 'غير مدفوع',
                      name_en: 'Not Paid',
                    },
                  ]}
                  label={t('Payment Status')}
                  placeholder={t('Payment Status')}
                  name="paymentStatusId"
                  onCustomChange={(paymentStatusId: any) =>
                    createQueryString('paymentStatus', paymentStatusId?.id ?? '')
                  }
                />
                <DatePicker
                  format="dd/MM/yyyy"
                  label={t('Date')}
                  name="date"
                  onChange={(value, context) => {
                    if (context.validationError) {
                      createQueryString('Date', '');
                      setValue('date', '');
                    } else {
                      createQueryString('Date', fDate(value as Date));
                    }
                  }}
                  slotProps={{ textField: { fullWidth: true } }}
                  sx={{}}
                />
              </Box>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
      <Box mt={4}>
        <SharedTable
          dataFiltered={dataFiltered.map((e) => ({ id: e.order_id, ...e }))}
          count={count}
          table={table}
          enableExportImport={false}
          tableHeaders={TABLE_HEAD}
          additionalTableProps={additionalTableProps}
          enableActions
          disablePagination
          showFromClients
          actions={[
            {
              label: t('view'),
              icon: 'solar:eye-bold',
              onClick: (item: IOrderDetails) => router.push(`/dashboard/orders/${item?.order_id}`),
            },
            // {
            //   label: t('edit'),
            //   icon: 'solar:pen-bold',
            //   onClick: () => {},
            // },
          ]}
        />
      </Box>
    </Container>
  );
}

function applyFilter({
  inputData,
  comparator,
}: {
  inputData: IOrder[];
  comparator: (a: any, b: any) => number;
  dateError: boolean;
}) {
  const stabilizedThis = inputData?.map((el, index) => [el, index] as const);

  stabilizedThis?.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis?.map((el) => el[0]);

  return inputData;
}

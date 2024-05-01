'use client';

import { t } from 'i18next';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { DatePicker } from '@mui/x-date-pickers';

import { paths } from 'src/routes/paths';
import { useRouter, usePathname, useSearchParams } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { getErrorMessage } from 'src/utils/axios';
import { getNameKeyLang } from 'src/utils/helperfunction';
import { fDate, getMinDiff } from 'src/utils/format-time';

import { IWarehouse } from 'src/@types/warehouse';
import { IOrder, ICardData, IOrderDetails } from 'src/@types/orders';
import { setOrderAsReady, setOrderAsProcessing } from 'src/actions/orders-actions';

import SharedTable from 'src/components/shared-table';
import { useSettingsContext } from 'src/components/settings';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useTable, getComparator } from 'src/components/table';
import FormProvider from 'src/components/hook-form/form-provider';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import CutomAutocompleteView, { ITems } from 'src/components/AutoComplete/CutomAutocompleteView';

import { getInvoice } from './orders-helper-function';
import InvoicePreviewDialog from './invoice-pdf-viewer';
import AnalyticsWidgetSummary from './analytics-widget-summary';

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
    id: 'PENDING',
    name: getNameKeyLang() === 'name_en' ? 'New' : 'جديدة',
    name_en: 'New',
    name_ar: 'جديدة',
  },
  {
    id: 'PROCESSING',
    name: getNameKeyLang() === 'name_en' ? 'Processing' : 'قيد التجهيز',
    name_en: 'Processing',
    name_ar: 'قيد التجهيز',
  },
  {
    id: 'CONFIRMED',
    name: getNameKeyLang() === 'name_en' ? 'Accepted by driver' : 'مقبوله من السائقين',
    name_en: 'Accepted by driver',
    name_ar: 'وافق عليها السائق',
  },
  {
    id: 'PICKED_UP',
    name: getNameKeyLang() === 'name_en' ? 'Picked up' : 'تم التجهيز',
    name_en: 'Picked up',
    name_ar: 'تم التجهيز',
  },
  {
    id: 'DELIVERED',
    name: getNameKeyLang() === 'name_en' ? 'Delivered' : 'تم التوصيل',
    name_en: 'Delivered',
    name_ar: 'تم التوصيل',
  },
  {
    id: 'CANCELLED',
    name: getNameKeyLang() === 'name_en' ? 'Cancelled' : 'تم الإلغاء',
    name_en: 'Cancelled',
    name_ar: 'تم الإلغاء',
  },
];

export function OrdersView({
  orders,
  cardsData,
  count,
  warehouses,
  drivers,
  title,
  DisableCards = false,
}: {
  count: number;
  orders: IOrder[];
  cardsData?: ICardData;
  warehouses: IWarehouse[];
  drivers: ITems[];
  DisableCards?: boolean;
  title: string;
}) {
  const invoiceController = useBoolean();
  const [pdfFile, setPdfFile] = useState<string | undefined>(undefined);
  const settings = useSettingsContext();
  const table = useTable({ defaultOrderBy: 'createDate' });
  const [filters, setFilters] = useState({
    name: '',
  });

  const methods = useForm();
  const { setValue } = methods;
  const dataFiltered = applyFilter({
    inputData: orders,
    comparator: getComparator(table.order, table.orderBy),
    filters,
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
    onRenderphone: (item: IOrder) => <span dir="ltr">{item?.user?.phone}</span>,
    onRenderorder_products: (item: IOrder) => item?.order_products,
    onRendertotal_price: (item: IOrder) =>
      (Number(item?.total_price) + Number(item?.delivery_fee)).toFixed(2),
    onRenderorder_created_at: (item: IOrder) => fDate(item?.order_created_at, 'dd-MM-yyyy'),
    onRenderis_paid: (item: IOrder) => t(item?.is_paid ? 'Paid' : 'Not Paid'),
    onRenderdelivary_type: (item: IOrder) => t(item?.delivery_type),
    onRenderstatus: (item: IOrder) => t(item?.shipments?.status),
    onRenderpayment_method: (item: IOrder) => t(item?.payment_method),
    onRenderdriver: (item: IOrder) => t(item?.shipments?.driver?.username ?? 'Not Assigned'),
    onRenderwarehouse: (item: IOrder) => item?.warehouse?.name,
  };

  const { value: isDialogOpen, onTrue: openDialog, onFalse: closeDialog } = useBoolean(false);
  const [dialogType, setDialogType] = useState<'setAsProcessing' | 'setAsReady'>();
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  const openProcessingDailog = () => {
    setDialogType('setAsProcessing');
    openDialog();
  };
  const openReadyDailog = () => {
    setDialogType('setAsReady');
    openDialog();
  };
  const handleConfirmProcessing = async () => {
    closeDialog();
    const res = selectedOrderId && (await setOrderAsProcessing(selectedOrderId));
    if (res?.message === 'Success') {
      enqueueSnackbar(t('status_has_changed_successfuly'), {
        variant: 'success',
      });
    } else {
      enqueueSnackbar(`${getErrorMessage(res?.message)}`, { variant: 'error' });
    }
  };
  const handleConfirmReady = async () => {
    closeDialog();
    const res = selectedOrderId && (await setOrderAsReady(selectedOrderId));
    if (res?.message === 'Success') {
      enqueueSnackbar(t('status_has_changed_successfuly'), {
        variant: 'success',
      });
    } else {
      enqueueSnackbar(`${getErrorMessage(res?.message)}`, { variant: 'error' });
    }
  };

  const handleInvoice = async (orderId: string) => {
    const res = await getInvoice(orderId);
    if (res?.error) {
      enqueueSnackbar(res.error, { variant: 'error' });
    } else {
      setPdfFile(res.url);
      invoiceController.onTrue();
    }
  };
  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading={t(title)}
        links={[
          {
            name: t('Orders'),
            href: paths.dashboard.ordersGroup.root,
          },
          {
            name: t(title),
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      {!DisableCards && (
        <Grid container spacing={2} alignItems="stretch" sx={{ mb: 6 }}>
          <Grid item xs={12} sm={6} md={3} sx={{ '&>*': { height: '100%' } }}>
            <AnalyticsWidgetSummary
              title={t('Total Orders')}
              total={cardsData?.ordersTotal ?? 0}
              color="info"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} sx={{ '&>*': { height: '100%' } }}>
            <AnalyticsWidgetSummary
              title={t('new_orders')}
              total={cardsData?.ordersNew ?? 0}
              color="info"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} sx={{ '&>*': { height: '100%' } }}>
            <AnalyticsWidgetSummary
              title={t('drivers_accepted_orders')}
              total={cardsData?.ordersDriversAccepted ?? 0}
              color="info"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} sx={{ '&>*': { height: '100%' } }}>
            <AnalyticsWidgetSummary
              title={t('processing_orders')}
              total={cardsData?.ordersProcessing ?? 0}
              color="info"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} sx={{ '&>*': { height: '100%' } }}>
            <AnalyticsWidgetSummary
              title={t('ready_for_pick_up_orders')}
              total={cardsData?.ordersReadyForPickup ?? 0}
              color="info"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} sx={{ '&>*': { height: '100%' } }}>
            <AnalyticsWidgetSummary
              title={t('picked_up_orders')}
              total={cardsData?.ordersPicked ?? 0}
              color="info"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} sx={{ '&>*': { height: '100%' } }}>
            <AnalyticsWidgetSummary
              title={t('delivered_orders')}
              total={cardsData?.ordersDelivered ?? 0}
              color="info"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} sx={{ '&>*': { height: '100%' } }}>
            <AnalyticsWidgetSummary
              title={t('cancelled_orders')}
              total={cardsData?.ordersCanceled ?? 0}
              color="info"
            />
          </Grid>
        </Grid>
      )}
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
      <SharedTable
        dataFiltered={dataFiltered?.map((item) => {
          if (item?.shipments?.status === 'PENDING' && -getMinDiff(item?.order_created_at) >= 15) {
            const sx = { backgroundColor: 'error.lighter' };
            return { id: item.order_id, ...item, sx };
          }
          return { id: item.order_id, ...item };
        })}
        count={count}
        table={table}
        // onImport={importSections}
        // onExport={exportSections}
        enableExportImport={false}
        tableHeaders={TABLE_HEAD}
        additionalTableProps={additionalTableProps}
        // handleFilters={handleFilters}
        filters={filters}
        enableActions
        actions={[
          {
            label: t('view'),
            icon: 'solar:eye-bold',
            onClick: (item: IOrderDetails) => router.push(`/dashboard/orders/${item?.order_id}`),
          },
          {
            label: t('Set as "Processing"'),
            icon: 'solar:pen-bold',
            onClick: (selectedRow) => {
              setSelectedOrderId(selectedRow.shipments.id);
              openProcessingDailog();
            },
            hideActionIf(selectedRow) {
              return !(selectedRow.shipments?.status === 'CONFIRMED');
            },
          },
          {
            label: t('Set as "Ready for pickup"'),
            icon: 'solar:pen-bold',
            onClick: (selectedRow) => {
              setSelectedOrderId(selectedRow.shipments.id);
              openReadyDailog();
            },
            hideActionIf(selectedRow) {
              return !(selectedRow.shipments?.status === 'PROCESSING');
            },
          },
          {
            label: t('preview_invoice'),
            icon: 'solar:eye-bold',
            onClick: (selectedRow) => {
              handleInvoice(selectedRow.order_id);
            },
          },
        ]}
      />
      {/* Confirm Dialog */}
      <ConfirmDialog
        open={isDialogOpen}
        onClose={closeDialog}
        title={t(dialogType === 'setAsReady' ? 'Set as "Ready for pickup"' : 'Set as "Processing"')}
        content={t(dialogType === 'setAsReady' ? 'setAsReady_confirm' : 'setAsProcessing_confirm')}
        action={
          <Button
            variant="contained"
            onClick={dialogType === 'setAsReady' ? handleConfirmReady : handleConfirmProcessing}
          >
            {t(dialogType === 'setAsReady' ? 'Set as "Ready for pickup"' : 'Set as "Processing"')}
          </Button>
        }
      />
      {pdfFile && (
        <InvoicePreviewDialog
          open={invoiceController.value}
          onClose={invoiceController.onFalse}
          src={pdfFile}
        />
      )}
    </Container>
  );
}

interface IFilters {
  name: string;
}
function applyFilter({
  inputData,
  comparator,
  filters,
  dateError,
}: {
  inputData: IOrder[];
  comparator: (a: any, b: any) => number;
  filters: IFilters;
  dateError: boolean;
}) {
  const { name } = filters;

  const stabilizedThis = inputData?.map((el, index) => [el, index] as const);

  stabilizedThis?.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis?.map((el) => el[0]);

  if (name) {
    inputData = inputData?.filter((order) => order.order_number);
  }

  return inputData;
}

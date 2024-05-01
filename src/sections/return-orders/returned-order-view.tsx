'use client';

import { t } from 'i18next';
import { useForm } from 'react-hook-form';
import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import { DatePicker } from '@mui/x-date-pickers';

import { paths } from 'src/routes/paths';
import { useRouter, usePathname, useSearchParams } from 'src/routes/hooks';

import { fDate } from 'src/utils/format-time';
import { getNameKeyLang } from 'src/utils/helperfunction';

import { RETURN_ORDER, ReturnOrderProducts } from 'src/@types/return-orders';

import SharedTable from 'src/components/shared-table';
import { useSettingsContext } from 'src/components/settings';
import { useTable, getComparator } from 'src/components/table';
import FormProvider from 'src/components/hook-form/form-provider';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import CutomAutocompleteView, { ITems } from 'src/components/AutoComplete/CutomAutocompleteView';

const TABLE_HEAD = [
  { id: 'order_number', label: 'order_number' },
  { id: 'order_created_at', label: 'order_created_at' },
  { id: 'username', label: 'name' },
  { id: 'phone', label: 'phone' },
  { id: 'order_products', label: 'order_products' },
  { id: 'total_price', label: 'total_price' },
  { id: 'payment_method', label: 'payment_method' },
  { id: 'status', label: 'status' },
  { id: 'driver', label: 'driver' },
];
const order_status: ITems[] = [
  {
    id: 'ACCEPTED',
    name: getNameKeyLang() === 'name_en' ? 'ACCEPTED' : 'مقبول',
    name_en: 'ACCEPTED',
    name_ar: 'مقبول',
  },
  {
    id: 'PENDING',
    name: getNameKeyLang() === 'name_en' ? 'PENDING' : 'قيد الموافقة',
    name_en: 'PENDING',
    name_ar: 'قيد الموافقة',
  },
  {
    id: 'REJECTED',
    name: getNameKeyLang() === 'name_en' ? 'REJECTED' : 'مرفوض',
    name_en: 'REJECTED',
    name_ar: 'مرفوض',
  },
];
export function ReturnOrdersView({
  orders,
  count,
  title,
}: {
  count: number;
  orders: RETURN_ORDER[];
  title: string;
}) {
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
    onRenderorder_number: (item: RETURN_ORDER) => item?.return_number,
    onRenderorder_created_at: (item: RETURN_ORDER) => fDate(item?.created_at, 'dd-MM-yyyy'),
    onRenderusername: (item: RETURN_ORDER) => item?.order?.user?.name,
    onRenderphone: (item: RETURN_ORDER) => <span dir="ltr">{item?.order.user?.phone}</span>,
    onRenderorder_products: (item: RETURN_ORDER) => item?.returnOrderProducts?.length,
    onRendertotal_price: (item: RETURN_ORDER) =>
      item?.returnOrderProducts?.reduce(
        (acc, cur: ReturnOrderProducts) => acc + cur.quantity * +cur.price,
        0
      ),
    onRenderstatus: (item: RETURN_ORDER) => t(item?.status),
    onRenderpayment_method: (item: RETURN_ORDER) => t(item?.order?.payment_method),
    onRenderdriver: (item: RETURN_ORDER) => t(item?.driver?.username ?? 'Not Assigned'),
  };
  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading={t(title)}
        links={[{}]}
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
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(2, 1fr)',
                  sm: 'repeat(3, 1fr)',
                }}
              >
                <CutomAutocompleteView
                  items={order_status}
                  label={t('Order Status')}
                  placeholder={t('Order Status')}
                  name="orderStatusId"
                  onCustomChange={(orderStatus: any) =>
                    createQueryString('orderStatus', orderStatus?.id ?? '')
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
        dataFiltered={dataFiltered}
        count={count}
        table={table}
        enableExportImport={false}
        tableHeaders={TABLE_HEAD}
        additionalTableProps={additionalTableProps}
        filters={filters}
        enableActions
        actions={[
          {
            label: t('view'),
            icon: 'solar:eye-bold',
            onClick: (item: RETURN_ORDER) =>
              router.push(
                `${paths.dashboard.returnRequests}/${item?.order.id}?returnOrder=${item?.id}`
              ),
          },
        ]}
      />
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
  inputData: RETURN_ORDER[];
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
    inputData = inputData?.filter((order) => order?.order?.number);
  }

  return inputData;
}

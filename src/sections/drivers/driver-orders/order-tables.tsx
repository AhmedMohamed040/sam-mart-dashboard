import { useMemo } from 'react';
import { useRouter } from 'next/navigation';

import Box from '@mui/material/Box';

import { fDate, fTime } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';
import { META, HANDLEDED_ORDERS_LIST } from 'src/@types/dashboard-drivers';

import Label from 'src/components/label';
import SharedTable from 'src/components/shared-table';
import { useTable, getComparator } from 'src/components/table';

const DriverOrdersTable = ({
  orders,
  meta,
}: {
  orders: HANDLEDED_ORDERS_LIST[] | [];
  meta: META;
}) => {
  const { t } = useTranslate();
  const router = useRouter();
  const TABLE_HEAD = useMemo(
    () => [
      { id: 'orderNumber', label: t('order_number') },
      { id: 'orderDate', label: t('order_date') },
      { id: 'orderStatus', label: t('order_status') },
      { id: 'price', label: t('price') },
      { id: 'clientName', label: t('client_name') },
      { id: 'clientPhone', label: t('client_phone') },
      { id: 'paymentMethod', label: t('payment_method') },
      { id: 'deliveryType', label: t('delivery_type') },
      { id: 'arrivalTime', label: t('arrival_time') },
      { id: 'arrivalDate', label: t('arrival_date') },
    ],
    [t]
  );
  const table = useTable();
  const filters = {
    name: '',
  };
  const dataFiltered = applyFilter({
    inputData: orders,
    comparator: getComparator(table.order, table.orderBy),
    filters,
    dateError: false,
  });
  const additionalTableProps = {
    onRenderorderNumber: (item: HANDLEDED_ORDERS_LIST) => item?.number,
    onRenderorderDate: (item: HANDLEDED_ORDERS_LIST) =>
      item?.delivery_day ? fDate(new Date(item.delivery_day), 'dd-MM-yyyy') : '',
    onRenderorderStatus: (item: HANDLEDED_ORDERS_LIST) => (
      <Label variant="soft" color="info">
        {t(item?.status)}
      </Label>
    ),
    onRenderprice: (item: HANDLEDED_ORDERS_LIST) => item?.total_price,
    onRenderclientName: (item: HANDLEDED_ORDERS_LIST) => item?.name,
    onRenderclientPhone: (item: HANDLEDED_ORDERS_LIST) => (
      <Box style={{ direction: 'ltr' }}>{item?.phone}</Box>
    ),
    onRenderpaymentMethod: (item: HANDLEDED_ORDERS_LIST) => (
      <Label variant="soft" color="info">
        {t(item?.payment_method)}
      </Label>
    ),
    onRenderdeliveryType: (item: HANDLEDED_ORDERS_LIST) => (
      <Label variant="soft" color="info">
        {t(item?.delivery_type)}
      </Label>
    ),
    onRenderarrivalTime: (item: HANDLEDED_ORDERS_LIST) => (
      <Box style={{ direction: 'ltr' }}>{fTime(new Date())}</Box>
    ),
    onRenderarrivalDate: (item: HANDLEDED_ORDERS_LIST) =>
      item?.delivery_day ? fDate(new Date(item.delivery_day), 'dd-MM-yyyy') : '',
  };
  const handleDetails = ({ orderId }: HANDLEDED_ORDERS_LIST) => {
    router.push(`/dashboard/orders/${orderId}`);
  };
  return (
    <SharedTable
      dataFiltered={dataFiltered.map((e) => ({ id: e.orderId, ...e }))}
      count={meta.itemCount}
      table={table}
      enableExportImport={false}
      tableHeaders={TABLE_HEAD}
      additionalTableProps={additionalTableProps}
      // handleFilters={handleFilters}
      filters={filters}
      enableActions
      disablePagination
      showFromClients
      actions={[
        {
          label: t('details'),
          icon: 'mdi:card-account-details-outline',
          onClick: (item) => {
            handleDetails(item);
          },
        },
      ]}
    />
  );
};

export default DriverOrdersTable;

interface IFilters {
  name: string;
}
function applyFilter({
  inputData,
  comparator,
  filters,
  dateError,
}: {
  inputData: HANDLEDED_ORDERS_LIST[] | [];
  comparator: (a: any, b: any) => number;
  filters: IFilters;
  dateError: boolean;
}) {
  const { name } = filters;

  const stabilizedThis = inputData.map((el: any, index: number) => [el, index] as const);

  stabilizedThis?.sort((a: any, b: any) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis?.map((el: any) => el[0]);

  if (name) {
    inputData = inputData?.filter(
      (content) => content.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  return inputData;
}

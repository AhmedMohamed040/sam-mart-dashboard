'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';

import { fDate } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';
import { META, Transaction } from 'src/@types/walelt-and-transactions';

import SharedTable from 'src/components/shared-table';
import { useTable, getComparator } from 'src/components/table';

interface Props {
  transactions: Transaction[] | [];
  meta: META;
  username: string;
  userType: 'client' | 'driver';
}
export default function TransactionsTable({ transactions, meta, username, userType }: Props) {
  const { t } = useTranslate();
  const router = useRouter();
  const table = useTable();
  const TABLE_HEAD = useMemo(
    () => [
      { id: 'OrderNumber', label: t('order_number') },
      { id: 'Username', label: t(userType === 'client' ? 'client' : 'driver') },
      { id: 'Created_at', label: t('created_at') },
      { id: 'Updated_at', label: t('updated_at') },
      { id: 'Deleted_at', label: t('deleted_at') },
      { id: 'Amount', label: t('transaction_amount') },
    ],
    [t, userType]
  );
  const additionalTableProps = {
    onRenderOrderNumber: (item: Transaction) => item.order.number,
    onRenderUsername: () => username,
    onRenderCreated_at: (item: Transaction) =>
      item?.created_at ? fDate(item.created_at, 'dd-MM-yyyy') : '',
    onRenderUpdated_at: (item: Transaction) =>
      item?.updated_at ? fDate(item.updated_at, 'dd-MM-yyyy') : '',
    onRenderDeleted_at: (item: Transaction) =>
      item?.deleted_at ? fDate(item.deleted_at, 'dd-MM-yyyy') : '',
    onRenderAmount: (item: Transaction) => <Box style={{ direction: 'ltr' }}>{item.amount}</Box>,
  };
  const filters = {
    name: '',
  };
  const dataFiltered = applyFilter({
    inputData: transactions,
    comparator: getComparator(table.order, table.orderBy),
    filters,
    dateError: false,
  });
  return (
    <Card sx={{ p: 3, mb: 1 }}>
      <Typography variant="h4" mb={4}>
        {t('transactions')}
      </Typography>
      <SharedTable
        dataFiltered={dataFiltered}
        count={meta.total}
        table={table}
        enableExportImport={false}
        tableHeaders={TABLE_HEAD}
        additionalTableProps={additionalTableProps}
        showFromClients
        disablePagination
        // handleFilter={() => {}}
        filters={filters}
        enableActions
        actions={[
          {
            label: t('order_details'),
            icon: 'lets-icons:order',
            onClick: (item: Transaction) => {
              router.push(`${paths.dashboard.ordersGroup.root}/${item.order_id}`);
            },
          },
          {
            label: t('user_details'),
            icon: 'mdi:user',
            onClick: (item: Transaction) => {
              router.push(`${paths.dashboard.clients}/${item.user_id}`);
            },
          },
        ]}
      />
    </Card>
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
  inputData: Transaction[] | [];
  comparator: (a: any, b: any) => number;
  filters: IFilters;
  dateError: boolean;
}) {
  const { name } = filters;

  //   const stabilizedThis = inputData.map((el: any, index: number) => [el, index] as const);

  //   stabilizedThis?.sort((a: any, b: any) => {
  //     const order = comparator(a[0], b[0]);
  //     if (order !== 0) return order;
  //     return a[1] - b[1];
  //   });

  //   inputData = stabilizedThis?.map((el: any) => el[0]);

  if (name) {
    inputData = inputData?.filter(
      (content: Transaction) => content.user_id.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  return inputData;
}

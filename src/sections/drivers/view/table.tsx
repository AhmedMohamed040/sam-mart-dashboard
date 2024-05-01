import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import Box from '@mui/material/Box';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDate } from 'src/utils/format-time';
import { getCustomNameKeyLang } from 'src/utils/helperfunction';

import { useTranslate } from 'src/locales';
import { META, DriverViewTableRow } from 'src/@types/dashboard-drivers';

import SharedTable from 'src/components/shared-table';
import Label, { LabelColor } from 'src/components/label';
import { useTable, getComparator } from 'src/components/table';

import AssignEditDriverWarehouse from './assign-edit-driver-in-warehouse';

const STATUS_COLOR: { [key: string]: LabelColor | undefined } = {
  PENDING: 'warning',
  VERIFIED: 'success',
  INACTIVE: 'secondary',
  SUSPENDED: 'default',
  BLOCKED: 'error',
};
const DriversViewTable = ({
  content,
  meta,
  warehouses,
}: {
  content: DriverViewTableRow[] | [];
  meta: META;
  warehouses: { [key: string]: string }[];
}) => {
  const { t } = useTranslate();
  const router = useRouter();
  const AssignController = useBoolean();
  const [selectedDriver, setSelectedDriver] = useState<DriverViewTableRow | null>(null);
  const TABLE_HEAD = useMemo(
    () => [
      { id: 'driverName', label: t('driver_name') },
      { id: 'phoneNumber', label: t('phone_number') },
      { id: 'email', label: t('email') },
      { id: 'dateOfBirth', label: t('date_of_birth') },
      { id: 'nationalResidenceId', label: t('national_residence_id') },
      { id: 'registrationDate', label: t('registration_date') },
      { id: 'registrationStatus', label: t('registration_status') },
      { id: 'country', label: t('country') },
      { id: 'city', label: t('city') },
      { id: 'region', label: t('region') },
      { id: 'vehicleType', label: t('vehicle_type') },
      { id: 'maximumOrders', label: t('maximum_orders') },
      { id: 'wallet', label: t('wallet') },
      { id: 'warehouse', label: t('warehouse') },
    ],
    [t]
  );
  const table = useTable();
  const filters = {
    name: '',
  };
  const dataFiltered = applyFilter({
    inputData: content,
    comparator: getComparator(table.order, table.orderBy),
    filters,
    dateError: false,
  });
  const additionalTableProps = {
    onRenderdriverName: (item: DriverViewTableRow) => item?.username,
    onRenderphoneNumber: (item: DriverViewTableRow) => (
      <Box style={{ direction: 'ltr' }}>{item?.phone}</Box>
    ),
    onRenderemail: (item: DriverViewTableRow) => item?.email,
    onRenderdateOfBirth: (item: DriverViewTableRow) =>
      item?.birth_date ? fDate(item.birth_date, 'dd-MM-yyyy') : '',
    onRendernationalResidenceId: (item: DriverViewTableRow) => item?.id_card_number,
    onRenderregistrationDate: (item: DriverViewTableRow) =>
      item?.created_at ? fDate(item.created_at, 'dd-MM-yyyy') : '',
    onRenderregistrationStatus: (item: DriverViewTableRow) => (
      <Label variant="soft" color={STATUS_COLOR[item?.driver_status]}>
        {t(item?.driver_status)}
      </Label>
    ),
    onRendercountry: (item: DriverViewTableRow) =>
      getCustomNameKeyLang(item?.country.name_en, item?.country.name_ar),
    onRendercity: (item: DriverViewTableRow) =>
      getCustomNameKeyLang(item?.city.name_en, item?.city.name_ar),
    onRenderregion: (item: DriverViewTableRow) =>
      getCustomNameKeyLang(item?.region.name_en, item?.region.name_ar),
    onRendervehicleType: (item: DriverViewTableRow) => item?.vehicle_type,
    onRendermaximumOrders: (item: DriverViewTableRow) => item?.maximumOrders,
    onRenderwallet: (item: DriverViewTableRow) => (
      <Box style={{ direction: 'ltr' }}>{item?.wallet_balance}</Box>
    ),
    onRenderwarehouse: (item: DriverViewTableRow) =>
      getCustomNameKeyLang(item?.warehouse.name_en, item?.warehouse.name_ar),
  };
  return (
    <>
      <SharedTable
        dataFiltered={dataFiltered}
        count={meta.itemCount}
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
            label: t('details'),
            icon: 'mdi:card-account-details-outline',
            onClick: (item) => {
              router.push(`${paths.dashboard.drivers}/${item.id}/details`);
            },
          },
          {
            label: t('orders'),
            icon: 'fluent-mdl2:activate-orders',
            onClick: (item) => {
              router.push(
                item?.warehouse?.id ? `${paths.dashboard.drivers}/${item.id}/orders` : ``
              );
            },
            hideActionIf: (item) => !item?.warehouse?.id,
          },
          {
            label: t('assign_edit_driver_warehouse'),
            icon: 'pajamas:assignee',
            onClick: (item) => {
              setSelectedDriver(item);
              AssignController.onTrue();
            },
            hideActionIf: (item) => item.driver_status !== 'VERIFIED',
          },
          {
            label: t('wallet'),
            icon: 'ion:wallet-outline',
            onClick: (item) => {
              router.push(`${paths.dashboard.drivers}/${item.user_id}/wallet`);
            },
          },
          {
            label: t('edit'),
            icon: 'clarity:edit-solid',
            onClick: (item) => {
              router.push(`${paths.dashboard.drivers}/${item.id}/edit`);
            },
          },
        ]}
      />
      {selectedDriver && (
        <AssignEditDriverWarehouse
          open={AssignController.value}
          onClose={() => {
            setSelectedDriver(null);
            AssignController.onFalse();
          }}
          driver={selectedDriver}
          warehouses={warehouses}
        />
      )}
    </>
  );
};

export default DriversViewTable;

interface IFilters {
  name: string;
}
function applyFilter({
  inputData,
  comparator,
  filters,
  dateError,
}: {
  inputData: DriverViewTableRow[] | [];
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
      (content: DriverViewTableRow) =>
        content.username.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  return inputData;
}

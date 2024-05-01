import { useSnackbar } from 'notistack';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDate } from 'src/utils/format-time';
import { getCustomNameKeyLang } from 'src/utils/helperfunction';

import { useTranslate } from 'src/locales';
import { META, EmployeeTableRow } from 'src/@types/employees';
import { deleteEmployee } from 'src/actions/employees-actions';

import SharedTable from 'src/components/shared-table';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useTable, getComparator } from 'src/components/table';

import ToggleEmployeeStatus from './toggle-employee-status';

const EmployeesViewTable = ({ employees, meta }: { employees: any; meta: META }) => {
  const [deletionID, setDeletionID] = useState<string | null>('');
  const { enqueueSnackbar } = useSnackbar();
  const confirm = useBoolean();
  const { t } = useTranslate();
  const router = useRouter();
  const TABLE_HEAD = useMemo(
    () => [
      { id: 'employeeImg', label: t('logo') },
      { id: 'employeeName', label: t('employee_name') },
      { id: 'phoneNumber', label: t('phone_number') },
      { id: 'email', label: t('email') },
      { id: 'gender', label: t('gender') },
      { id: 'qualification', label: t('qualification') },
      { id: 'registrationDate', label: t('registration_date') },
      { id: 'country', label: t('country') },
      { id: 'city', label: t('city') },
      { id: 'employeeStatus', label: t('employee_status') },
    ],
    [t]
  );
  const table = useTable();
  const filters = {
    name: '',
  };
  const dataFiltered = applyFilter({
    inputData: employees,
    comparator: getComparator(table.order, table.orderBy),
    filters,
    dateError: false,
  });
  const additionalTableProps = {
    onRenderemployeeImg: (employee: EmployeeTableRow) =>
      employee?.avatar ? (
        <Avatar
          alt={getCustomNameKeyLang(employee.name_en, employee.name_ar)}
          src={employee.avatar}
        />
      ) : (
        <Avatar
          alt="dummy-placeholder"
          src="https://dev.barq-mart.online/v1/storage/avatars/avatar--1710316413239.jpg
    "
        />
      ),
    onRenderemployeeName: (employee: EmployeeTableRow) =>
      getCustomNameKeyLang(employee.name_en, employee.name_ar),
    onRenderphoneNumber: (employee: EmployeeTableRow) => (
      <Box style={{ direction: 'ltr' }}>{employee?.phone}</Box>
    ),
    onRenderemail: (employee: EmployeeTableRow) => employee?.email,
    onRendergender: (employee: EmployeeTableRow) => t(employee?.gender),
    onRenderqualification: (employee: EmployeeTableRow) => employee?.qualification,
    onRenderregistrationDate: (employee: EmployeeTableRow) =>
      employee?.created_at ? fDate(employee.created_at, 'dd-MM-yyyy') : '',
    onRendercountry: (employee: EmployeeTableRow) =>
      getCustomNameKeyLang(employee.country_name_en, employee.country_name_ar),
    onRendercity: (employee: EmployeeTableRow) =>
      getCustomNameKeyLang(employee.city_name_en, employee.city_name_ar),
    onRenderemployeeStatus: (employee: EmployeeTableRow) => (
      <ToggleEmployeeStatus id={employee.id} is_active={employee?.is_active} />
    ),
  };
  const handleDelete = async (id: string) => {
    const res = await deleteEmployee(id);
    if (res?.error) {
      enqueueSnackbar(`${res.error}`, { variant: 'error' });
    } else {
      enqueueSnackbar(t('employee_was_deleted_successfully'));
    }
  };
  return (
    <>
      <ConfirmDialog
        open={confirm.value}
        onClose={() => {
          setDeletionID(null);
          confirm.onFalse();
        }}
        title={t('delete')}
        content={t('are_you_sure_you_want_to_delete_this_employee')}
        action={
          <Button
            variant="contained"
            color="error"
            onClick={async () => {
              if (deletionID) {
                await handleDelete(deletionID);
              }
              confirm.onFalse();
            }}
          >
            {t('delete')}
          </Button>
        }
      />
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
            label: t('edit'),
            icon: 'akar-icons:edit',
            onClick: (employee) => {
              router.push(`/dashboard/employees/${employee.id}/edit`);
            },
          },
          {
            label: t('delete'),
            icon: 'fluent:delete-48-regular',
            onClick: (employee) => {
              confirm.onTrue();
              setDeletionID(employee.id);
            },
            sx: { color: 'red' },
          },
        ]}
      />
    </>
  );
};

export default EmployeesViewTable;

interface IFilters {
  name: string;
}
function applyFilter({
  inputData,
  comparator,
  filters,
  dateError,
}: {
  inputData: EmployeeTableRow[] | [];
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
      (content: EmployeeTableRow) =>
        content.name_ar.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  return inputData;
}

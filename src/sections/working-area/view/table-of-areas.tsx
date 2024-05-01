import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { enqueueSnackbar } from 'notistack';

import Button from '@mui/material/Button';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { useLocales, useTranslate } from 'src/locales';
import { deleteWorkingArea } from 'src/actions/working-area';
import type { ItemContent, TableContent } from 'src/@types/working-area';

import SharedTable from 'src/components/shared-table';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useTable, getComparator } from 'src/components/table';

import ToggleWorkArea from './toggle-workarea';

const WorkingAreaViewTable = ({ tableData }: { tableData: TableContent[] }) => {
  const router = useRouter();
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const confirm = useBoolean();
  const [deletionID, setDeletionID] = useState<any>();
  const filters = {
    name: '',
  };
  const TABLE_HEAD = useMemo(
    () => [
      { id: 'AreaName', label: t('area_name') },
      { id: 'City', label: t('city') },
      { id: 'Address', label: t('address') },
      { id: 'AvailableSpace', label: t('available_space') },
      { id: 'Status', label: t('status') },
    ],
    [t]
  );
  const table = useTable();
  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
    dateError: false,
  });

  const handleEditArea = (item: any) => {
    //
    router.push(`${paths.dashboard.workingArea}/${item.id}/edit`);
  };
  const handleDeleteArea = async (id: string) => {
    const res = await deleteWorkingArea(id);
    if (res?.error) {
      enqueueSnackbar(res?.error, { variant: 'error' });
    } else {
      enqueueSnackbar(t('working_area_was_deleted_successfully'));
    }
  };
  const additionalTableProps = {
    onRenderAreaName: (item: ItemContent) => item.name,
    onRenderCity: (item: ItemContent) =>
      currentLang.value === 'en' ? item.city.name_en : item.city.name_ar,
    onRenderAddress: (item: ItemContent) => (
      <a
        href={`https://www.google.com/maps/search/?api=1&query=${item.latitude},${item.longitude}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: 'black' }}
      >
        {t('click_here')}
      </a>
    ),
    onRenderAvailableSpace: (item: ItemContent) => item.range,
    onRenderStatus: (item: ItemContent) => (
      <ToggleWorkArea id={item.id} is_active={item?.is_active} />
    ),
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
        content={t('are_you_sure_you_want_to_delete_this_working_area')}
        action={
          <Button
            variant="contained"
            color="error"
            onClick={async () => {
              await handleDeleteArea(deletionID);
              confirm.onFalse();
            }}
          >
            {t('delete')}
          </Button>
        }
      />
      <SharedTable
        dataFiltered={dataFiltered}
        count={tableData.length}
        table={table}
        enableExportImport={false}
        tableHeaders={TABLE_HEAD}
        additionalTableProps={additionalTableProps}
        // handleFilters={handleFilters}
        filters={filters}
        enableActions
        hidePaginationOnly
        actions={[
          {
            label: t('edit'),
            icon: 'bx:edit',
            onClick: (item: ItemContent) => {
              handleEditArea(item);
            },
          },
          {
            label: t('delete'),
            icon: 'material-symbols-light:delete-outline',
            sx: { color: 'red' },
            onClick: (item: ItemContent) => {
              confirm.onTrue();
              setDeletionID(item.id);
            },
          },
        ]}
      />
    </>
  );
};

export default WorkingAreaViewTable;

interface IFilters {
  name: string;
}
function applyFilter({
  inputData,
  comparator,
  filters,
  dateError,
}: {
  inputData: TableContent[];
  comparator: (a: any, b: any) => number;
  filters: IFilters;
  dateError: boolean;
}) {
  const { name } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis?.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis?.map((el) => el[0]);

  if (name) {
    inputData = inputData?.filter(
      (workingAreas) => workingAreas.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  return inputData;
}

'use client';

import { useSnackbar } from 'notistack';
import { useState, useCallback } from 'react';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

import { useBoolean } from 'src/hooks/use-boolean';

import { Units } from 'src/@types/units';
import { useTranslate } from 'src/locales';
import { deleteUnit } from 'src/actions/units-actions';
import { SubCategories } from 'src/@types/sub-categories';

import Iconify from 'src/components/iconify';
import SharedTable from 'src/components/shared-table';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import { useTable, getComparator } from 'src/components/table';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';

import AddEditUnit from './add-edit-unit/add-edit-unit';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name_ar', label: 'name_ar' },
  { id: 'name_en', label: 'name_en' },
];

interface IProps {
  units: Units[];
}

export default function UnitsView({ units }: IProps) {
  const [selectedUnitId, setSelectedUnitId] = useState<string | undefined>(undefined);
  const [showAddUnit, setShowAddUnit] = useState<boolean | undefined>(false);
  const [selectedUnit, setSelectedUnit] = useState<Units | undefined>(undefined);
  const settings = useSettingsContext();
  const table = useTable({ defaultOrderBy: 'createDate' });
  const confirm = useBoolean();

  const { enqueueSnackbar } = useSnackbar();

  const { t } = useTranslate();

  const [filters, setFilters] = useState({ name: '' });

  const handleConfirmDelete = async () => {
    if (typeof selectedUnitId === 'string') {
      const res = await deleteUnit(selectedUnitId);
      if (res?.error) {
        enqueueSnackbar(`${res?.error}`, { variant: 'error' });
      } else {
        enqueueSnackbar(t('Deleted success!'));
      }
    }

    confirm.onFalse();
    setSelectedUnitId(undefined);
  };

  const dataFiltered = applyFilter({
    inputData: units,
    comparator: getComparator(table.order, table.orderBy),
    filters,
    dateError: false,
  });

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
    onRenderlogo: (item: SubCategories) => (
      <Avatar src={item?.logo} alt={item?.logo} sx={{ mr: 2 }}>
        {item?.name_en?.charAt(0)?.toUpperCase()}
      </Avatar>
    ),
  };
  const handleShowPopup = () => {
    setShowAddUnit(true);
  };
  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading={t('units')}
        links={[{}]}
        action={
          <Button
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => {
              handleShowPopup();
              setSelectedUnit(undefined);
            }}
          >
            {t('add_unit')}
          </Button>
        }
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <SharedTable
        dataFiltered={dataFiltered}
        table={table}
        count={0}
        enableExportImport={false}
        tableHeaders={TABLE_HEAD}
        additionalTableProps={additionalTableProps}
        handleFilters={handleFilters}
        filters={filters}
        disablePagination
        enableActions
        actions={[
          {
            label: t('edit'),
            icon: 'solar:pen-bold',
            onClick: (item: Units) => {
              setShowAddUnit(true);
              setSelectedUnit(item);
            },
          },

          {
            label: t('delete'),
            icon: 'solar:trash-bin-trash-bold',
            onClick: (item: Units) => {
              confirm.onTrue();
              setSelectedUnitId(item?.id);
            },
            sx: { color: 'error.main' },
          },
        ]}
      />
      {showAddUnit && (
        <AddEditUnit
          open={showAddUnit}
          onClose={() => {
            setShowAddUnit(false);
            setSelectedUnit(undefined);
          }}
          selectedUnit={selectedUnit}
        />
      )}
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title={t('delete')}
        content={t('delete_confirm')}
        action={
          <Button variant="contained" color="error" onClick={handleConfirmDelete}>
            {t('delete')}
          </Button>
        }
      />
    </Container>
  );
}

function applyFilter({
  inputData,
  comparator,
  filters,
  dateError,
}: {
  inputData: Units[];
  comparator: (a: any, b: any) => number;
  filters: { name: string };
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
    inputData = inputData?.filter(
      (section) => section.name_en.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  return inputData;
}

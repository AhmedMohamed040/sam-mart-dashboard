'use client';

// import { useSnackbar } from 'notistack';
import { useState, useCallback } from 'react';

import Button from '@mui/material/Button';

import uuidv4 from 'src/utils/uuidv4';

import { useTranslate } from 'src/locales';

// import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

// import Iconify from 'src/components/iconify';
import SharedTable from 'src/components/shared-table';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useTable, getComparator } from 'src/components/table';

import NewEditCurrency from './new-edit-form';
// ----------------------------------------------------------------------
interface CURRENCY {
  id: string;
  name_ar: string;
  name_en: string;
}
const TABLE_HEAD = [
  { id: 'name_ar', label: 'name_ar' },
  { id: 'name_en', label: 'name_en' },
];

const MOCK_CURRENCIES = [
  { id: uuidv4(), name_ar: 'ريال يمني', name_en: 'YER' },
  { id: uuidv4(), name_ar: 'ريال سعودي', name_en: 'SAR' },
  { id: uuidv4(), name_ar: 'الغطاس المصري', name_en: 'EGP' },
];
export default function CurrenciesTable() {
  const editController = useBoolean();
  const [selectedCurrency, setSelectedCurrency] = useState<CURRENCY | null>(null);
  const [deletionID, setDeletionID] = useState<string | null>(null);
  const table = useTable();
  //   const router = useRouter();
  //   const { enqueueSnackbar } = useSnackbar();

  const { t } = useTranslate();
  const confirm = useBoolean();

  const [filters, setFilters] = useState({ name: '' });

  const dataFiltered = applyFilter({
    inputData: MOCK_CURRENCIES,
    comparator: getComparator(table.order, table.orderBy),
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
  const handleDeletion = async (id: string) => {};

  const additionalTableProps = {};
  return (
    <>
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
            icon: 'ep:edit',
            onClick: (item) => {
              setSelectedCurrency(item);
              editController.onTrue();
            },
          },
          {
            label: t('delete'),
            icon: 'material-symbols-light:delete-outline',
            sx: { color: 'red' },
            onClick: (item) => {
              confirm.onTrue();
              setDeletionID(item.id);
            },
          },
        ]}
      />
      <ConfirmDialog
        open={confirm.value}
        onClose={() => {
          setDeletionID(null);
          confirm.onFalse();
        }}
        title={t('delete')}
        content={t('are_you_sure_you_want_to_delete_this_currency')}
        action={
          <Button
            variant="contained"
            color="error"
            onClick={async () => {
              if (typeof deletionID === 'string') {
                await handleDeletion(deletionID);
              }
              confirm.onFalse();
            }}
          >
            {t('delete')}
          </Button>
        }
      />
      {selectedCurrency && (
        <NewEditCurrency
          open={editController.value}
          onClose={() => {
            setSelectedCurrency(null);
            editController.onFalse();
          }}
          currency={selectedCurrency}
        />
      )}
    </>
  );
}

function applyFilter({
  inputData,
  comparator,
}: {
  inputData: CURRENCY[];
  comparator: (a: any, b: any) => number;
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

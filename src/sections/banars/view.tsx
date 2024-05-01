'use client';

import { useSnackbar } from 'notistack';
import { useRouter } from 'next/navigation';
import { useState, useCallback } from 'react';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { Banar } from 'src/@types/banar';
import { useTranslate } from 'src/locales';
import { ICategory } from 'src/@types/categories';
import { deleteBanar } from 'src/actions/banars-actions';

import Iconify from 'src/components/iconify';
import SharedTable from 'src/components/shared-table';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import { useTable, getComparator } from 'src/components/table';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';

import { convertDate } from '../offers/view';
import ToggleBanarView from './toggle-banars';

// ----------------------------------------------------------------------

type IProps = {
  banars: Banar[];
  count: number;
};

export default function BanarsView({ banars, count }: Readonly<IProps>) {
  const settings = useSettingsContext();
  const table = useTable({ defaultOrderBy: 'createDate' });
  const confirm = useBoolean();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslate();
  const router = useRouter();
  const [filters, setFilters] = useState({ name: '' });
  const [selectedBanarID, setSelectedBanarID] = useState<string | undefined>(undefined);
  const dataFiltered = applyFilter({
    inputData: banars,
    comparator: getComparator(table.order, table.orderBy),
    filters,
    dateError: false,
  });

  const TABLE_HEAD = [
    { id: 'banar', label: 'banar' },
    { id: 'started_at', label: 'Start date' },
    { id: 'ended_at', label: 'End date' },
    { id: 'is_active', label: 'status' },
  ];

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
    onRenderbanar: (item: Banar) => (
      <Avatar src={item?.banar} alt={item?.banar} sx={{ mr: 2 }}>
        {item?.banar?.charAt(0)?.toUpperCase()}
      </Avatar>
    ),
    onRenderis_active: (item: Banar) => (
      <ToggleBanarView id={item.id} is_active={item?.is_active || false} />
    ),
    onRenderstarted_at: (item: Banar) => {
      if (item.started_at) {
        return convertDate(item?.started_at || '');
      }
      return '';
    },
    onRenderended_at: (item: Banar) => {
      if (item.ended_at) {
        return convertDate(item?.ended_at);
      }
      return '';
    },
  };
  const handleConfirmDelete = async () => {
    if (typeof selectedBanarID === 'string') {
      const res = await deleteBanar(selectedBanarID);
      if (res?.error) {
        enqueueSnackbar(`${res?.error}`, { variant: 'error' });
      } else {
        enqueueSnackbar(t('Deleted success!'), {
          variant: 'success',
        });
      }
    }

    confirm.onFalse();
    setSelectedBanarID(undefined);
  };
  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading={t('banars')}
        links={[{}]}
        action={
          <Button
            component={RouterLink}
            href="/dashboard/banars/new"
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            {t('add_banar')}
          </Button>
        }
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <SharedTable
        dataFiltered={dataFiltered}
        table={table}
        count={count}
        enableExportImport={false}
        tableHeaders={TABLE_HEAD}
        additionalTableProps={additionalTableProps}
        handleFilters={handleFilters}
        filters={filters}
        enableActions
        disablePagination
        showFromClients
        actions={[
          {
            label: t('edit'),
            icon: 'solar:pen-bold',
            onClick: (item: Banar) => router.push(`/dashboard/banars/edit/${item.id}`),
          },

          {
            label: t('delete'),
            icon: 'solar:trash-bin-trash-bold',
            onClick: (item: ICategory) => {
              confirm.onTrue();
              setSelectedBanarID(item?.id);
            },
            sx: { color: 'error.main' },
          },
        ]}
      />
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
  inputData: Banar[];
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
      (section) => section.banar.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  return inputData;
}

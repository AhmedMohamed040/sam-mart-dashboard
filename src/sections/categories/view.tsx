'use client';

import { useSnackbar } from 'notistack';
import { useRouter } from 'next/navigation';
import { useState, useCallback } from 'react';

import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Container from '@mui/material/Container';

import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { useTranslate } from 'src/locales';
import { ICategory } from 'src/@types/categories';
import { deleteCategory } from 'src/actions/categories-actions';

import Iconify from 'src/components/iconify';
import SharedTable from 'src/components/shared-table';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import { useTable, getComparator } from 'src/components/table';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';

// ----------------------------------------------------------------------

type IProps = {
  categories: ICategory[];
  count: number;
};

export default function CategoriesView({ categories, count }: Readonly<IProps>) {
  const settings = useSettingsContext();
  const table = useTable({ defaultOrderBy: 'createDate' });
  const confirm = useBoolean();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslate();
  const router = useRouter();
  const [filters, setFilters] = useState({ name: '' });
  const [selectedCategoryID, setSelectedCategoryID] = useState<string | undefined>(undefined);
  const dataFiltered = applyFilter({
    inputData: categories,
    comparator: getComparator(table.order, table.orderBy),
    filters,
    dateError: false,
  });

  const TABLE_HEAD = [
    { id: 'logo', label: 'image' },
    { id: 'name_ar', label: 'name_ar' },
    { id: 'name_en', label: 'name_en' },
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
    onRenderlogo: (item: ICategory) => (
      <Avatar src={item?.logo} alt={item?.logo} sx={{ mr: 2 }}>
        {item?.name?.charAt(0)?.toUpperCase()}
      </Avatar>
    ),
  };
  const handleConfirmDelete = async () => {
    if (typeof selectedCategoryID === 'string') {
      const res = await deleteCategory(selectedCategoryID);
      if (res?.error) {
        enqueueSnackbar(`${res?.error}`, { variant: 'error' });
      } else {
        enqueueSnackbar(t('Deleted success!'), {
          variant: 'success',
        });
      }
    }

    confirm.onFalse();
    setSelectedCategoryID(undefined);
  };
  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading={t('categories')}
        links={[{}]}
        action={
          <Button
            component={RouterLink}
            href="/dashboard/categories/new"
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            {t('add_category')}
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
        actions={[
          {
            label: t('edit'),
            icon: 'solar:pen-bold',
            onClick: (item: ICategory) => router.push(`/dashboard/categories/edit/${item.id}`),
          },

          {
            label: t('delete'),
            icon: 'solar:trash-bin-trash-bold',
            onClick: (item: ICategory) => {
              confirm.onTrue();
              setSelectedCategoryID(item?.id);
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
  inputData: ICategory[];
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
      (section) => section.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  return inputData;
}

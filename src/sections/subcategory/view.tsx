'use client';

import { useSnackbar } from 'notistack';
import { useState, useCallback } from 'react';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { useTranslate } from 'src/locales';
import { SubCategories } from 'src/@types/sub-categories';
import { deleteSubcategory } from 'src/actions/sub-categories-actions';

import Iconify from 'src/components/iconify';
import SharedTable from 'src/components/shared-table';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import { useTable, getComparator } from 'src/components/table';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'logo', label: 'image' },
  { id: 'name_ar', label: 'name_ar' },
  { id: 'name_en', label: 'name_en' },
];

interface IProps {
  categories: SubCategories[];
  count: number;
}

export default function SubCategoriesView({ categories, count }: IProps) {
  const [selectedSubcategoryID, setSelectedSubcategoryID] = useState<string | undefined>(undefined);
  const settings = useSettingsContext();
  const table = useTable({ defaultOrderBy: 'createDate' });
  const confirm = useBoolean();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const { t } = useTranslate();

  const [filters, setFilters] = useState({ name: '' });

  const handleConfirmDelete = async () => {
    try {
      if (typeof selectedSubcategoryID === 'string') {
        await deleteSubcategory(selectedSubcategoryID);
        enqueueSnackbar(t('Deleted success!'), {
          variant: 'success',
        });
      }
    } catch (error) {
      enqueueSnackbar(error.message, {
        variant: 'error',
      });
    }
    confirm.onFalse();
    setSelectedSubcategoryID(undefined);
  };

  const dataFiltered = applyFilter({
    inputData: categories,
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

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading={t('sub_categories')}
        links={[{}]}
        action={
          <Button
            component={RouterLink}
            href={`${paths.dashboard.subCategories}/new`}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            {t('add_sub_category')}
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
            onClick: (item: SubCategories) =>
              router.push(`${paths.dashboard.subCategories}/edit/${item?.id}`),
          },
          {
            label: t('delete'),
            icon: 'solar:trash-bin-trash-bold',
            onClick: (item: SubCategories) => {
              confirm.onTrue();
              setSelectedSubcategoryID(item?.id);
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
  inputData: SubCategories[];
  comparator: (a: any, b: any) => number;
  filters: { name: string };
  dateError: boolean;
}) {
  // const { name } = filters;

  // const stabilizedThis = inputData?.map((el, index) => [el, index] as const);

  // stabilizedThis?.sort((a, b) => {
  //   const order = comparator(a[0], b[0]);
  //   if (order !== 0) return order;
  //   return a[1] - b[1];
  // });

  // inputData = stabilizedThis?.map((el) => el[0]);

  // if (name) {
  //   inputData = inputData?.filter(
  //     (section) => section.name_en.toLowerCase().indexOf(name.toLowerCase()) !== -1
  //   );
  // }

  return inputData;
}

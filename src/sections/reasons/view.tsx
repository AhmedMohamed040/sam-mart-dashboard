'use client';

import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useRouter, usePathname, useSearchParams } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { getCustomNameKeyLang } from 'src/utils/helperfunction';

import { useTranslate } from 'src/locales';
import { IReason, REASON_TYPES } from 'src/@types/reasons';
import { deleteReasons } from 'src/actions/reasons-action';

import Iconify from 'src/components/iconify';
import SharedTable from 'src/components/shared-table';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import { useTable, getComparator } from 'src/components/table';
import FormProvider from 'src/components/hook-form/form-provider';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import CutomAutocompleteView, { ITems } from 'src/components/AutoComplete/CutomAutocompleteView';

type props = {
  reasons: IReason[];
  count: number;
  type: string;
};
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name_ar', label: 'name_ar' },
  { id: 'name_en', label: 'name_en' },
  { id: 'type', label: 'type' },
  { id: 'roles', label: 'roles' },
];

export default function ReasonsView({ reasons, count, type }: Readonly<props>) {
  const settings = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const table = useTable({ defaultOrderBy: 'createDate' });
  const confirm = useBoolean();
  const router = useRouter();
  const { t } = useTranslate();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState({
    name: '',
  });
  const [selectedReasonID, setSelectedReasonID] = useState<string | undefined>(undefined);
  const pathname = usePathname();
  const selectedType: ITems = { id: type, name: type, name_ar: t(type), name_en: type };

  const methods = useForm({
    defaultValues: {
      typeId: selectedType,
    },
  });
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams]
  );

  const dataFiltered = applyFilter({
    inputData: reasons,
    comparator: getComparator(table.order, table.orderBy),
    filters,
    dateError: false,
  });
  const handleConfirmDelete = useCallback(async () => {
    if (typeof selectedReasonID === 'string') {
      const res = await deleteReasons({ id: selectedReasonID });
      if (res?.error) {
        enqueueSnackbar(`${res?.error}`, { variant: 'error' });
      } else {
        enqueueSnackbar(t('Deleted success!'), {
          variant: 'success',
        });
        // Refresh Page
        if (searchParams.get('refresh_string') !== '1') {
          createQueryString('refresh_string', '1');
        } else {
          createQueryString('refresh_string', '2');
        }
      }
    }

    confirm.onFalse();
    setSelectedReasonID(undefined);
  }, [confirm, createQueryString, enqueueSnackbar, searchParams, selectedReasonID, t]);
  const additionalTableProps = {
    onRendername: (item: IReason) => getCustomNameKeyLang(item?.name_en, item?.name_ar),
    onRendertype: (item: IReason) => t(item?.type),
    onRenderroles: (item: IReason) => {
      let roles = '';
      if (item?.roles?.length) {
        item.roles.forEach((role) => {
          if (roles?.length) roles += ' - ';
          roles += t(role);
        });
      }
      return roles;
    },
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading={t('Reasons')}
        links={[{}]}
        action={
          <Button
            component={RouterLink}
            href={`${paths.dashboard.reasons}/add`}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            {t('New Reason')}
          </Button>
        }
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      <FormProvider methods={methods}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card sx={{ p: 3, ml: 3, mb: 1 }}>
              <Box
                rowGap={1}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(2, 1fr)',
                  sm: 'repeat(3, 1fr)',
                }}
              >
                <CutomAutocompleteView
                  items={REASON_TYPES}
                  label={t('type')}
                  placeholder={t('type')}
                  name="typeId"
                  onCustomChange={(selectedTypeId: any) =>
                    createQueryString('type', selectedTypeId?.id ?? '')
                  }
                />
              </Box>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
      <SharedTable
        dataFiltered={dataFiltered}
        count={count}
        table={table}
        // onImport={importSections}
        // onExport={exportSections}
        enableExportImport={false}
        tableHeaders={TABLE_HEAD}
        additionalTableProps={additionalTableProps}
        // handleFilters={handleFilters}
        filters={filters}
        enableActions
        actions={[
          {
            label: t('edit'),
            icon: 'solar:pen-bold',
            onClick: (item: IReason) => router.push(`/dashboard/reasons/edit/${item?.id}`),
          },
          {
            label: t('delete'),
            icon: 'solar:trash-bin-trash-bold',
            onClick: (reason) => {
              confirm.onTrue();
              setSelectedReasonID(reason?.id);
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

interface IFilters {
  name: string;
}
function applyFilter({
  inputData,
  comparator,
  filters,
  dateError,
}: {
  inputData: IReason[];
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
      (reason) =>
        reason.name_ar.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        reason.name_en.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  return inputData;
}

'use client';

import Cookies from 'js-cookie';
import { useSnackbar } from 'notistack';
import { useState, useCallback } from 'react';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import axiosInstance, { endpoints, getErrorMessage } from 'src/utils/axios';

import { useTranslate } from 'src/locales';
// import { exportAttachedProducts } from 'src/actions/product-actions';
import { deleteSection, exportSections, importSections } from 'src/actions/sections-actions';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import SharedTable from 'src/components/shared-table';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import { useTable, getComparator } from 'src/components/table';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';

import { ISection } from 'src/types/sections';

import ToggleSectionView from './toggle-section';

type props = {
  sections: ISection[];
};
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'logo', label: 'image' },
  { id: 'name_ar', label: 'name_ar' },
  { id: 'name_en', label: 'name_en' },
  { id: 'delivery_price', label: 'delivery_price' },
  { id: 'min_order_price', label: 'min_order_price' },
  { id: 'delivery_type', label: 'delivery_type' },
  { id: 'is_active', label: 'state' },
];

export default function SectionsView({ sections }: Readonly<props>) {
  const [selectedSectionID, setSelectedSectionID] = useState<string | undefined>(undefined);
  const settings = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const table = useTable({ defaultOrderBy: 'createDate' });
  const confirm = useBoolean();
  const router = useRouter();
  const { t } = useTranslate();
  const [filters, setFilters] = useState({ name: '' });
  const handleConfirmDelete = async () => {
    if (typeof selectedSectionID === 'string') {
      const res = await deleteSection(selectedSectionID);
      if (res?.error) {
        enqueueSnackbar(`${res?.error}`, { variant: 'error' });
      } else {
        enqueueSnackbar(t('Deleted success!'), {
          variant: 'success',
        });
      }
    }

    confirm.onFalse();
    setSelectedSectionID(undefined);
  };

  const dataFiltered = applyFilter({
    inputData: sections,
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
    onRenderdelivery_type: (item: ISection) => (
      <>
        {item?.delivery_type?.split('&').map((delivery_type: string) => (
          <Label
            key={delivery_type}
            variant="soft"
            color={
              (delivery_type === 'SCHEDULED' && 'success') ||
              (delivery_type === 'FAST' && 'warning') ||
              'default'
            }
          >
            {t(delivery_type)}
          </Label>
        ))}
      </>
    ),
    onRenderlogo: (item: ISection) => (
      <Avatar src={item?.logo} alt={item?.logo} sx={{ mr: 2 }}>
        {item?.name?.charAt(0)?.toUpperCase()}
      </Avatar>
    ),
    onRenderis_active: (item: ISection) => (
      <ToggleSectionView id={item.id} is_active={item?.is_active} />
    ),
  };
  const exportAllAttachedProducts = async () => {
    const accessToken = Cookies.get('accessToken');
    const lang = Cookies.get('Language');

    try {
      const res = await axiosInstance.get(endpoints.product.attachedExport, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Accept-Language': lang,
        },
        responseType: 'blob',
      });
      const blob = new Blob([res.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);

      // Create a link element
      const link = document.createElement('a');
      link.href = url;
      link.download = `${t('attached_products')}.xlsx`; // Specify the filename for the downloaded file
      document.body.appendChild(link);

      // Trigger the download
      link.click();

      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (err) {
      enqueueSnackbar(getErrorMessage(err), { variant: 'error' });
    }
  };
  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading={t('Sections')}
        links={[{}]}
        action={
          <Button
            component={RouterLink}
            href={`${paths.dashboard.sections}/new`}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            {t('New Section')}
          </Button>
        }
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <SharedTable
        dataFiltered={dataFiltered}
        count={dataFiltered?.length}
        table={table}
        onImport={importSections}
        onExport={exportSections}
        enableExportImport={false}
        tableHeaders={TABLE_HEAD}
        additionalTableProps={additionalTableProps}
        handleFilters={handleFilters}
        filters={filters}
        enableActions
        disablePagination
        enableAdd
        handleAdd={exportAllAttachedProducts}
        custom_add_title={t('export_products_to_excel')}
        addButtonCustomizations={{
          icon: 'bi:download',
        }}
        actions={[
          {
            label: t('view'),
            icon: 'solar:eye-bold',
            onClick: (item: ISection) => router.push(`${paths.dashboard.sections}/${item?.id}`),
          },
          {
            label: t('edit'),
            icon: 'solar:pen-bold',
            onClick: (item: ISection) =>
              router.push(`${paths.dashboard.sections}/edit/${item?.id}`),
          },
          {
            label: t('link_section_to_main_category'),
            icon: 'solar:link-bold',
            onClick: (item: ISection) =>
              router.push(`${paths.dashboard.sections}/${item?.id}?link=true`),
          },
          {
            label: t('delete'),
            icon: 'solar:trash-bin-trash-bold',
            onClick: (section) => {
              confirm.onTrue();
              setSelectedSectionID(section?.id);
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
  inputData: ISection[];
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
      (section) =>
        section.name.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        section.name_en.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  return inputData;
}

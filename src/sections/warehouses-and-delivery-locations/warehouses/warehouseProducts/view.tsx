'use client';

import Cookies from 'js-cookie';
import { useState } from 'react';
import { useSnackbar } from 'notistack';

import Avatar from '@mui/material/Avatar';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import axiosInstance, { endpoints, getErrorMessage } from 'src/utils/axios';
import { getNameKeyLang, getCustomNameKeyLang } from 'src/utils/helperfunction';

import { useTranslate } from 'src/locales';
import { IWarehouse } from 'src/@types/warehouse';

import SharedTable from 'src/components/shared-table';
import { useSettingsContext } from 'src/components/settings';
import { useTable, getComparator } from 'src/components/table';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';

import { IWarehouseProduct } from 'src/types/warehouse';

const TABLE_HEAD = [
  { id: 'barcode', label: 'barcode' },
  { id: 'logo', label: 'logo' },
  { id: 'name', label: 'name' },
  { id: 'quantity', label: 'quantity' },
  { id: 'mainUnit', label: 'mainUnit' },
];
interface Props {
  products: IWarehouseProduct[];
  count: number;
  warehouse: IWarehouse & { name_en: string };
}
export default function WareHouseProductView({ count, products, warehouse }: Props) {
  const { t } = useTranslate();
  const { enqueueSnackbar } = useSnackbar();
  const settings = useSettingsContext();
  const table = useTable({ defaultOrderBy: 'createDate' });
  const [filters, setFilters] = useState({
    name: '',
  });
  const dataFiltered = applyFilter({
    inputData: products,
    comparator: getComparator(table.order, table.orderBy),
    filters,
    dateError: false,
  });
  const additionalTableProps = {
    onRenderbarcode: (item: IWarehouseProduct) => item?.barcode,
    onRenderquantity: (item: IWarehouseProduct) => item.quantity,
    onRendermainUnit: (item: IWarehouseProduct) => item.product_measurement[getNameKeyLang()],
    onRenderlogo: (item: IWarehouseProduct) => (
      <Avatar src={item?.logo} alt={item?.name_en?.charAt(0)?.toUpperCase()} sx={{ mr: 2 }}>
        {item?.name_en?.charAt(0)?.toUpperCase()}
      </Avatar>
    ),
    onRendername: (item: IWarehouseProduct) => getCustomNameKeyLang(item.name_en, item.name_ar),
  };
  const exportAllAttachedProducts = async () => {
    const accessToken = Cookies.get('accessToken');
    const lang = Cookies.get('Language');

    try {
      const res = await axiosInstance.get(endpoints.warehouse.exportProducts, {
        params: {
          warehouse_id: warehouse.id,
        },
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
      link.download = `${getCustomNameKeyLang(warehouse.name_en, warehouse.name)}.xlsx`; // Specify the filename for the downloaded file
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
        heading={
          warehouse ? getCustomNameKeyLang(warehouse.name_en, warehouse.name) : t('warehouses')
        }
        links={[
          {
            name: t('warehouses'),
            href: paths.dashboard.warehousesAndDeliveryLocations,
          },
          {
            name: getCustomNameKeyLang(warehouse.name_en, warehouse.name),
            href: `${paths.dashboard.warehousesAndDeliveryLocations}/${warehouse.id}`,
          },
          {
            name: t('products'),
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      <SharedTable
        dataFiltered={dataFiltered}
        count={count}
        table={table}
        enableExportImport={false}
        tableHeaders={TABLE_HEAD}
        additionalTableProps={additionalTableProps}
        // handleFilters={handleFilters}
        filters={filters}
        enableAdd
        handleAdd={exportAllAttachedProducts}
        custom_add_title={t('export_products_to_excel')}
        addButtonCustomizations={{
          icon: 'bi:download',
        }}
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
  inputData: IWarehouseProduct[];
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
      (warehouse) => warehouse[getNameKeyLang()].toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  return inputData;
}

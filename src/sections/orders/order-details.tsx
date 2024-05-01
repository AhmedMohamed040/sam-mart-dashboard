'use client';

import { useState, useCallback } from 'react';

import Avatar from '@mui/material/Avatar';

import { useRouter } from 'src/routes/hooks';

import { useTranslate } from 'src/locales';
import { IShipments } from 'src/@types/orders';
import { exportSections, importSections } from 'src/actions/sections-actions';

import { useTable } from 'src/components/table';
import SharedTable from 'src/components/shared-table';

type props = {
  shipments: IShipments[];
  status: string;
  setReturnedProducts: any;
  returnedProducts: any;
  waitingStatus?: string;
};
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'barcode', label: 'barcode' },
  { id: 'product_logo', label: 'image' },
  { id: 'product_name', label: 'product name' },
  { id: 'category_name', label: 'Main Category' },
  { id: 'sub_category_name', label: 'Sub Category' },
  { id: 'price', label: 'Amount' },
  { id: 'quantity', label: 'quantity' },
  { id: 'total_price', label: 'Total' },
];

export default function OrderDetails({
  shipments,
  status,
  setReturnedProducts,
  returnedProducts,
  waitingStatus,
}: Readonly<props>) {
  const table = useTable({ defaultOrderBy: 'createDate' });
  const router = useRouter();
  const { t } = useTranslate();
  const [filters, setFilters] = useState({ name: '' });
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
    onRenderbarcode: (item: IShipments) => item?.barcode,
    onRenderproduct_logo: (item: IShipments) => (
      <Avatar src={item?.product_logo} alt={item?.product_logo} sx={{ mr: 2 }}>
        {item?.product_name_en?.charAt(0)?.toUpperCase()}
      </Avatar>
    ),
  };

  return (
    <SharedTable
      dataFiltered={shipments}
      count={shipments?.length}
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
      actions={
        waitingStatus === 'WAITING'
          ? [
              {
                label: t('accepte'),
                icon: 'healthicons:i-documents-accepted-outline',
                onClick: (item: IShipments) => setReturnedProducts(...returnedProducts, item),
              },
              {
                label: t('reject'),
                icon: 'healthicons:i-documents-denied-outline',
                onClick: (item: IShipments) => setReturnedProducts((prev: any) => [...prev, item]),
              },
            ]
          : [
              {
                label: t('tracking'),
                icon: 'fluent-mdl2:issue-tracking',
                onClick: (item: IShipments) => router.push(`/dashboard/orders/total`),
              },
            ]
      }
    />
  );
}

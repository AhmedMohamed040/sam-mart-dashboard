'use client';

import { useSnackbar } from 'notistack';
import { useRouter } from 'next/navigation';
import { useState, useCallback } from 'react';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDate } from 'src/utils/format-time';

import { Offers } from 'src/@types/offers';
import { useLocales, useTranslate } from 'src/locales';
import { deleteOffer } from 'src/actions/offers-actions';

import Iconify from 'src/components/iconify';
import SharedTable from 'src/components/shared-table';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import { useTable, getComparator } from 'src/components/table';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';

// ----------------------------------------------------------------------

type IProps = {
  offers: Offers[];
  count: number;
};

export function convertDate(dateString: string | undefined | Date) {
  const date = new Date(dateString || '');
  if (date.toString() === 'Invalid Date') return '';
  const year = date.getFullYear();
  const month = `0${date.getMonth() + 1}`.slice(-2);
  const day = `0${date.getDate()}`.slice(-2);
  return `${day}-${month}-${year}`;
}

export default function OffersView({ offers, count }: Readonly<IProps>) {
  const settings = useSettingsContext();
  const table = useTable({ defaultOrderBy: 'createDate' });
  const confirm = useBoolean();
  const { enqueueSnackbar } = useSnackbar();
  const { t, i18n } = useTranslate();
  const router = useRouter();
  const [filters, setFilters] = useState({ name: '' });
  const [selectedOfferID, setSelectedOfferID] = useState<string | undefined>(undefined);
  const { currentLang } = useLocales();

  const dataFiltered = applyFilter({
    inputData: offers.map((offer) => {
      const newOffer = offer;
      newOffer.name = currentLang.value === 'ar' ? offer.name_ar : offer.name_en;
      return { id: newOffer.offer_id, ...newOffer };
    }),
    comparator: getComparator(table.order, table.orderBy),
    filters,
    dateError: false,
  });

  const TABLE_HEAD = [
    { id: 'barcode', label: 'barcode' },
    { id: 'logo', label: 'image' },
    // { id: 'name_ar', label: 'name_ar' },
    // { id: 'name_en', label: 'name_en' },
    { id: 'name', label: 'name' },
    { id: 'startdate', label: 'Start date' },
    { id: 'enddate', label: 'End date' },
    { id: 'status', label: 'status' },
    { id: 'min_order_quantity', label: 'min_order_quantity' },
    { id: 'mix_order_quantity', label: 'max_order_quantity' },
    { id: 'offer_discount_value', label: 'Value_Percentage' },
    { id: 'offertype', label: 'discount_type' },
    { id: 'offer_price', label: 'price' },
    { id: 'offer_quantity', label: 'quantity' },
    { id: i18n.language === 'en' ? 'measurement_unit_en' : 'measurement_unit_ar', label: 'unit' },
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
    onRenderbarcode: (item: Offers) => item?.product_barcode,
    onRenderlogo: (item: Offers) => (
      <Avatar src={item?.product_logo} alt={item?.product_logo} sx={{ mr: 2 }}>
        {item?.name_en?.charAt(0)?.toUpperCase()}
      </Avatar>
    ),
    onRenderstatus: (item: Offers) => t(item?.offer_is_active ? 'Active' : 'Disabled'),
    onRenderenddate: (item: Offers) =>
      item?.offer_end_date ? fDate(new Date(item.offer_end_date), 'dd-MM-yyyy') : '',
    onRenderstartdate: (item: Offers) =>
      item?.offer_start_date ? fDate(new Date(item.offer_start_date), 'dd-MM-yyyy') : '',
    onRenderoffertype: (item: Offers) =>
      item?.offer_discount_type === 'VALUE' ? t('VALUE') : t('PERCENTAGE'),
  };
  const handleConfirmDelete = async () => {
    if (typeof selectedOfferID === 'string') {
      const res = await deleteOffer(selectedOfferID);
      if (res?.error) {
        enqueueSnackbar(`${res?.error}`, { variant: 'error' });
      } else {
        enqueueSnackbar(t('Deleted success!'), {
          variant: 'success',
        });
      }
    }

    confirm.onFalse();
    setSelectedOfferID(undefined);
  };
  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading={t('offers')}
        links={[{}]}
        action={
          <Button
            component={RouterLink}
            href={`${paths.dashboard.offers}/new`}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            {t('add_offer')}
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
            onClick: (item: Offers) =>
              router.push(`${paths.dashboard.offers}/edit/${item.offer_id}`),
          },

          {
            label: t('delete'),
            icon: 'solar:trash-bin-trash-bold',
            onClick: (item: Offers) => {
              confirm.onTrue();
              setSelectedOfferID(item?.offer_id);
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
  inputData: Offers[];
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
      (section) => section.name_en?.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  return inputData;
}

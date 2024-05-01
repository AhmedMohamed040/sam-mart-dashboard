'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';
import { Client, ClientsCardsData } from 'src/@types/clients';

import Iconify from 'src/components/iconify';
import SharedTable from 'src/components/shared-table';
import { useTable, getComparator } from 'src/components/table';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';

import { convertDate } from '../offers/view';
import AnalyticsWidgetSummary from '../orders/analytics-widget-summary';

// ----------------------------------------------------------------------

type IProps = {
  clients: Client[];
  count: number;
  cardsData: ClientsCardsData;
};

function convertDateToSend(dateString: string | Date) {
  const date = new Date(dateString || '');
  if (date.toString() === 'Invalid Date') return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function ClientsView({ clients, cardsData, count }: Readonly<IProps>) {
  const table = useTable({ defaultOrderBy: 'createDate' });
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const status: string | null = searchParams.get('status');
  const search: string | null = searchParams.get('search');
  const date: string = searchParams.get('created_at') || '';

  const [searchInput, setSearchInput] = useState(search);

  const { t } = useTranslate();
  const router = useRouter();
  const [filters, setFilters] = useState({ name: '' });
  const dataFiltered = applyFilter({
    inputData: clients,
    comparator: getComparator(table.order, table.orderBy),
    filters,
    dateError: false,
  });

  const TABLE_HEAD = [
    { id: 'username', label: 'username' },
    { id: 'phone', label: 'phone' },
    { id: 'email', label: 'email' },
    { id: 'birth_date', label: 'birth_date' },
    { id: 'created_at', label: 'registration_date' },
    { id: 'user_status', label: 'state' },
    { id: 'wallet_balance', label: 'wallet' },
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
    // eslint-disable-next-line consistent-return
    onRendercreated_at: (item: Client) => {
      if (item.created_at) {
        return convertDate(item?.created_at);
      }
      return '';
    },
    onRenderbirth_date: (item: Client) => {
      if (item.birth_date) {
        return convertDate(item?.birth_date);
      }
      return '';
    },
    onRenderphone: (item: Client) => <Box style={{ direction: 'ltr' }}>{item.phone}</Box>,
    onRenderuser_status: (item: Client) => (
      <Box
        sx={{
          backgroundColor:
            // eslint-disable-next-line no-nested-ternary
            item?.user_status === 'ActiveClient'
              ? '#43c272'
              : item?.user_status === 'CustomerPurchase'
                ? '#c2d551'
                : '#bb5257',
          padding: '5px',
          borderRadius: '5px',
          color: 'white',
          width: '80px',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        {t(`${item?.user_status}`)}
      </Box>
    ),
  };
  const handleFilterss = useCallback(
    // eslint-disable-next-line consistent-return
    (name: string, value: string | Date | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (name === 'created_at' && value !== null) {
        const dateValue = convertDateToSend(value);
        params.set(name, dateValue);
      } else if (name === 'created_at' && value === null) {
        params.set(name, '');
      } else if (typeof value === 'string') {
        params.set(name, value);
      }

      if (name === 'search') {
        const timeout = setTimeout(() => {
          router.push(`${pathname}?${params.toString()}`);
        }, 1000);

        return () => clearTimeout(timeout);
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router]
  );

  const [cleared, setCleared] = useState<boolean>(false);

  useEffect(() => {
    if (cleared) {
      const timeout = setTimeout(() => {
        setCleared(false);
      }, 1500);

      return () => clearTimeout(timeout);
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cleared]);
  return (
    <Container maxWidth="xl">
      <CustomBreadcrumbs
        heading={t('clients')}
        links={[{}]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Button
            sx={{
              width: '100%',
              position: 'relative',
              '&::after': {
                content: '""',
                display: status === 'total' || status === null ? 'block' : 'none',
                position: 'absolute',
                bottom: '-10px',
                marginX: 'auto',
                width: '90%',
                height: '2px',
                backgroundColor: '#347AE2',
              },
            }}
            onClick={() => handleFilterss('status', 'total')}
          >
            <AnalyticsWidgetSummary
              title={t('total_clients')}
              total={cardsData?.total ?? 0}
              color="info"
              customBgColor="#347AE2"
              customColor="white"
              customOpacity="1"
            />
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Button
            sx={{
              width: '100%',
              position: 'relative',
              '&::after': {
                content: '""',
                display: status === 'ActiveClient' ? 'block' : 'none',
                position: 'absolute',
                bottom: '-10px',
                marginX: 'auto',
                width: '90%',
                height: '2px',
                backgroundColor: '#49BE55',
              },
            }}
            onClick={() => handleFilterss('status', 'ActiveClient')}
          >
            <AnalyticsWidgetSummary
              title={t('active_clients')}
              total={cardsData?.active ?? 0}
              color="info"
              customBgColor="#49BE55"
              customColor="white"
              customOpacity="1"
            />
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Button
            sx={{
              width: '100%',
              position: 'relative',
              '&::after': {
                content: '""',
                display: status === 'CustomerPurchase' ? 'block' : 'none',
                position: 'absolute',
                bottom: '-10px',
                marginX: 'auto',
                width: '90%',
                height: '2px',
                backgroundColor: '#EAD72D',
              },
            }}
            onClick={() => handleFilterss('status', 'CustomerPurchase')}
          >
            <AnalyticsWidgetSummary
              title={t('purchasers')}
              total={cardsData?.purchased ?? 0}
              color="info"
              customBgColor="#EAD72D"
              customColor="white"
              customOpacity="1"
            />
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Button
            sx={{
              width: '100%',
              position: 'relative',
              '&::after': {
                content: '""',
                display: status === 'BlockedClient' ? 'block' : 'none',
                position: 'absolute',
                bottom: '-10px',
                marginX: 'auto',
                width: '90%',
                height: '2px',
                backgroundColor: '#E23434',
              },
            }}
            onClick={() => handleFilterss('status', 'BlockedClient')}
          >
            <AnalyticsWidgetSummary
              title={t('banned_clients')}
              total={cardsData?.blocked ?? 0}
              color="info"
              customBgColor="#E23434"
              customColor="white"
              customOpacity="1"
            />
          </Button>
        </Grid>
      </Grid>
      <Grid container spacing={2} sx={{ marginY: '20px' }}>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            value={searchInput}
            fullWidth
            onChange={(e) => {
              handleFilterss('search', e.target.value);
              setSearchInput(e.target.value);
            }}
            placeholder={`${t('search')}...`}
            sx={{ marginRight: '20px' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <DatePicker
            format="dd/MM/yyyy"
            defaultValue={date ? new Date(date) : null}
            sx={{ width: '100%' }}
            slotProps={{
              field: { clearable: true, onClear: () => setCleared(true) },
            }}
            label={t('registration_date')}
            onChange={(value: Date | null): void => {
              handleFilterss('created_at', value);
            }}
          />
        </Grid>
      </Grid>

      <SharedTable
        dataFiltered={dataFiltered}
        table={table}
        count={count}
        enableExportImport={false}
        tableHeaders={TABLE_HEAD}
        additionalTableProps={additionalTableProps}
        disablePagination
        showFromClients
        handleFilters={handleFilters}
        filters={filters}
        enableActions
        actions={[
          {
            label: t('view_info'),
            icon: 'solar:eye-bold',
            onClick: (item: Client) => router.push(`${paths.dashboard.clients}/${item.id}`),
          },
          {
            label: t('view_orders'),
            icon: 'solar:eye-bold',
            onClick: (item: Client) => router.push(`${paths.dashboard.clients}/${item.id}/orders`),
          },
          {
            label: t('view_wallet'),
            icon: 'solar:eye-bold',
            onClick: (item: Client) => router.push(`${paths.dashboard.clients}/${item.id}/wallet`),
          },
        ]}
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
  inputData: Client[];
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
      (section) => section?.username.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  return inputData;
}

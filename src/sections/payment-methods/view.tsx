'use client';

import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useRouter, usePathname, useSearchParams } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { useTranslate } from 'src/locales';
import { PaymentMethod } from 'src/@types/payment-methods';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import SharedTable from 'src/components/shared-table';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import { useTable, getComparator } from 'src/components/table';
import FormProvider from 'src/components/hook-form/form-provider';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import CutomAutocompleteView from 'src/components/AutoComplete/CutomAutocompleteView';

// ----------------------------------------------------------------------

type IProps = {
  paymentMethods: PaymentMethod[];
  count: number;
};

export function convertDate(dateString: string | undefined) {
  const date = new Date(dateString || '');
  if (date.toString() === 'Invalid Date') return '';
  const year = date.getFullYear();
  const month = `0${date.getMonth() + 1}`.slice(-2);
  const day = `0${date.getDate()}`.slice(-2);
  return `${day}-${month}-${year}`;
}

const TABLE_HEAD = [
  { id: 'logo', label: 'image' },
  { id: 'name', label: 'name' },
  { id: 'type', label: 'Type' },
  { id: 'status', label: 'status' },
  { id: 'wallet_number', label: 'Wallet Number' },
];

export default function PaymentsView({ paymentMethods, count }: Readonly<IProps>) {
  const settings = useSettingsContext();
  const table = useTable({ defaultOrderBy: 'createDate' });
  const confirm = useBoolean();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslate();
  const [filters, setFilters] = useState({ type: '' });
  const [selectedPaymentMethodID, setSelectedPaymentMethodID] = useState<string | undefined>(
    undefined
  );
  const methods = useForm();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams]
  );

  const dataFiltered = applyFilter({
    inputData: paymentMethods,
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
    onRenderlogo: (item: PaymentMethod) => (
      <Avatar src={item?.logo} alt={item?.logo} sx={{ mr: 2 }}>
        {item?.name?.charAt(0)?.toUpperCase()}
      </Avatar>
    ),
    onRenderstatus: (item: PaymentMethod) => (
      <Label variant="soft" color={item?.is_active ? 'success' : 'error'}>
        {t(item?.is_active ? 'Active' : 'Disabled')}
      </Label>
    ),
    onRendertype: (item: PaymentMethod) => t(item?.type),
  };

  const handleConfirmDelete = async () => {
    if (typeof selectedPaymentMethodID === 'string') {
      const res = { success: true, error: undefined };
      if (res?.error) {
        enqueueSnackbar(`${res?.error}`, { variant: 'error' });
      } else {
        enqueueSnackbar(t('Deleted success!'), {
          variant: 'success',
        });
      }
    }

    confirm.onFalse();
    setSelectedPaymentMethodID(undefined);
  };
  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading={t('Payment Methods')}
        links={[{}]}
        action={
          <Button
            component={RouterLink}
            href={`${paths.dashboard.paymentMethods}/new`}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            {t('Add Method')}
          </Button>
        }
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <FormProvider methods={methods}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card sx={{ p: 3, marginBlock: 3 }}>
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
                  items={[
                    {
                      id: 'WALLET',
                      name: 'WALLET',
                      name_ar: 'محفظة',
                      name_en: 'Wallet',
                    },
                    {
                      id: 'CASH',
                      name: 'CASH',
                      name_ar: 'كاش',
                      name_en: 'Cash',
                    },
                  ]}
                  label={t('Type')}
                  placeholder={t('Type')}
                  name="type"
                  onCustomChange={(type: any) => createQueryString('type', type?.id ?? '')}
                />
              </Box>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>

      <SharedTable
        dataFiltered={dataFiltered}
        table={table}
        count={count}
        tableHeaders={TABLE_HEAD}
        additionalTableProps={additionalTableProps}
        handleFilters={handleFilters}
        enableActions
        disablePagination
        showFromClients
        actions={[
          {
            label: t('edit'),
            icon: 'solar:pen-bold',
            onClick: (item: PaymentMethod) =>
              router.push(`${paths.dashboard.paymentMethods}/edit/${item.id}`),
          },

          {
            label: t('delete'),
            icon: 'solar:trash-bin-trash-bold',
            onClick: (item: PaymentMethod) => {
              confirm.onTrue();
              setSelectedPaymentMethodID(item?.id);
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
  inputData: PaymentMethod[];
  comparator: (a: any, b: any) => number;
  filters: { type: string };
  dateError: boolean;
}) {
  const { type } = filters;

  const stabilizedThis = inputData?.map((el, index) => [el, index] as const);

  stabilizedThis?.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis?.map((el) => el[0]);

  if (type) {
    inputData = inputData?.filter(
      (section) => section.type?.toLowerCase().indexOf(type.toLowerCase()) !== -1
    );
  }

  return inputData;
}

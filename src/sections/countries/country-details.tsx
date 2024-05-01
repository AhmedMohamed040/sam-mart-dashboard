'use client';

import { useSnackbar } from 'notistack';
import { useRouter } from 'next/navigation';
import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { getCustomNameKeyLang } from 'src/utils/helperfunction';

import { ICity } from 'src/@types/cities';
import { useTranslate } from 'src/locales';
import { Countries } from 'src/@types/countries';
import { deleteCity } from 'src/actions/cities-actions';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import SharedTable from 'src/components/shared-table';
import { useSettingsContext } from 'src/components/settings';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useTable, getComparator } from 'src/components/table';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import AddEditCity from './add-city/add-edit-city';

// ----------------------------------------------------------------------
type Props = {
  country: Countries;
  cities: ICity[];
};

const TABLE_HEAD = [
  { id: 'name_ar', label: 'name_ar' },
  { id: 'name_en', label: 'name_en' },
];

export default function CountryDetails({ cities, country }: Props) {
  const settings = useSettingsContext();
  const { t } = useTranslate();
  const router = useRouter();
  const [showAddCity, setShowAddEditCity] = useState<boolean | undefined>(false);
  const [selectedCity, setSelectedCity] = useState<ICity | undefined>(undefined);
  const table = useTable({ defaultOrderBy: 'createDate' });
  const [filters, setFilters] = useState({ name: '' });
  const [cityID, setCityID] = useState<string | undefined>(undefined);
  const confirm = useBoolean();
  const { enqueueSnackbar } = useSnackbar();
  const additionalTableProps = {
    onRendername_en: (item: ICity) => item.name_en,
    onRendername_ar: (item: ICity) => item.name_ar,
  };
  const dataFiltered = applyFilter({
    inputData: cities,
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

  const handleConfirmDelete = async () => {
    if (typeof cityID === 'string') {
      const res = await deleteCity({ id: cityID, countryID: country.id as string });
      if (res?.error) {
        enqueueSnackbar(`${res?.error}`, { variant: 'error' });
      } else {
        enqueueSnackbar(t('Deleted success!'), {
          variant: 'success',
        });
      }
    }

    confirm.onFalse();
    setCityID(undefined);
  };
  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading={t('country_details')}
        links={[
          {
            name: t('countries'),
            href: paths.dashboard.dataManagementsGroup.countries,
          },
          { name: getCustomNameKeyLang(country.name_en, country.name_ar) },
          { name: t('cities') },
        ]}
        action={
          <Button
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => {
              setShowAddEditCity(true);
            }}
          >
            {t('add_city')}
          </Button>
        }
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Card sx={{ pt: 5, px: 3 }}>
        <Box alignItems="center">
          <Stack spacing={2}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              {t('details')}
            </Typography>
            <Typography variant="subtitle2">
              {t('Name in Arabic')} :
              <Label sx={{ mx: 1 }} variant="soft">
                {country?.name_ar || t('unknown')}
              </Label>
            </Typography>
            <Typography variant="subtitle2">
              {t('Name in English')} :
              <Label sx={{ mx: 1 }} variant="soft">
                {country?.name_en || t('unknown')}
              </Label>
            </Typography>
          </Stack>
        </Box>

        <Divider sx={{ my: 3, borderStyle: 'dashed' }} />
        <Box sx={{ pb: 5 }}>
          <SharedTable
            custom_add_title={t('cities')}
            dataFiltered={dataFiltered}
            count={dataFiltered?.length}
            disablePagination
            additionalTableProps={additionalTableProps}
            table={table}
            tableHeaders={TABLE_HEAD}
            handleFilters={handleFilters}
            filters={filters}
            enableActions
            actions={[
              {
                label: t('view_regions'),
                icon: 'solar:eye-bold',
                onClick: (item: ICity) => {
                  router.push(`/dashboard/dataManagements/countries/city/${item.id}`);
                },
              },
              {
                label: t('edit'),
                icon: 'solar:pen-bold',
                onClick: (item: ICity) => {
                  setSelectedCity(item);
                  setShowAddEditCity(true);
                },
              },
              {
                label: t('delete'),
                icon: 'solar:trash-bin-trash-bold',
                onClick: (item: ICity) => {
                  confirm.onTrue();
                  setCityID(item?.id);
                },
                sx: { color: 'error.main' },
              },
            ]}
          />
          {showAddCity && (
            <AddEditCity
              open={showAddCity}
              onClose={() => {
                setShowAddEditCity(false);
              }}
              selectedCity={selectedCity}
              country={country}
            />
          )}
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
        </Box>
      </Card>
    </Container>
  );
}

function applyFilter({
  inputData,
  comparator,
  filters,
  dateError,
}: {
  inputData: ICity[];
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
      (category) => category.name_en.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  return inputData;
}

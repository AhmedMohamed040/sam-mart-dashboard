'use client';

import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

import { RouterLink } from 'src/routes/components';
import { useRouter, usePathname, useSearchParams } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { ICity } from 'src/@types/cities';
import { IRegion } from 'src/@types/regions';
import { Countries } from 'src/@types/countries';
import { IWarehouse } from 'src/@types/warehouse';
import { useLocales, useTranslate } from 'src/locales';
import { deleteWarehouse } from 'src/actions/warehouse-actions';

import Iconify from 'src/components/iconify';
import SharedTable from 'src/components/shared-table';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import { useTable, getComparator } from 'src/components/table';
import FormProvider from 'src/components/hook-form/form-provider';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import CutomAutocompleteView, { ITems } from 'src/components/AutoComplete/CutomAutocompleteView';

import ToggleWarehouseView from './toggle-warehouse';

type props = {
  warehouses: IWarehouse[];
  count: number;
  countries: Countries[];
  cities: ICity[];
  regions: IRegion[];
};
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'name' },
  { id: 'country', label: 'country' },
  { id: 'city', label: 'city' },
  { id: 'region', label: 'region' },
  { id: 'location', label: 'location' },
  { id: 'status', label: 'status' },
];

export default function WareHouseView({
  warehouses,
  count,
  cities,
  countries,
  regions,
}: Readonly<props>) {
  const settings = useSettingsContext();
  const table = useTable({ defaultOrderBy: 'createDate' });
  const { t } = useTranslate();
  const searchParams = useSearchParams();
  const country = searchParams?.get('country');
  const region = searchParams?.get('region');
  const city = searchParams?.get('city');
  const filters = useState({
    name: '',
  })[0];
  const { enqueueSnackbar } = useSnackbar();
  const confirm = useBoolean();
  const [selectedSectionID, setSelectedSectionID] = useState<string | undefined>(undefined);

  const handleEditWarehouse = (item: IWarehouse) => {
    router.push(`/dashboard/warehouses-and-delivery-locations/edit/${item.id}`);
  };
  const handleEditCities = (item: IWarehouse) => {
    router.push(`/dashboard/warehouses-and-delivery-locations/EditCities/${item.id}`);
  };
  const handleConfirmDelete = async () => {
    if (typeof selectedSectionID === 'string') {
      const res = await deleteWarehouse(selectedSectionID);
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
  // filters
  const methods = useForm({
    defaultValues: {
      cityId: { id: city },
      regionId: { id: region },
      countryId: { id: country },
    },
  });

  const { setValue } = methods;
  const pathname = usePathname();
  const router = useRouter();
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      if (name === 'country') {
        setValue('cityId', { id: null });
        setValue('regionId', { id: null });
        params?.delete('city');
        params?.delete('region');
      } else if (name === 'city') {
        setValue('regionId', { id: null });
        params?.delete('region');
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams, setValue]
  );

  const {
    currentLang: { value: lang },
  } = useLocales();

  const dataFiltered = applyFilter({
    inputData: warehouses.map((item) => {
      const newItem = item;
      if (lang === 'en') {
        newItem.name = item.name_en || item.name;
        newItem.region.name = item.region.name_en || item.region.name;
        newItem.region.city.name = item.region.city.name_en || item.region.city.name;
        newItem.region.city.country.name =
          item.region.city.country.name_en || item.region.city.country.name;
      }
      return newItem;
    }),
    comparator: getComparator(table.order, table.orderBy),
    filters,
    dateError: false,
  });
  const additionalTableProps = {
    onRendercountry: (item: IWarehouse) => item.region.city.country.name,
    onRendercity: (item: IWarehouse) => item.region.city.name,
    onRenderregion: (item: IWarehouse) => item.region.name,
    onRenderstatus: (item: IWarehouse) => (
      <ToggleWarehouseView id={item.id} is_active={item?.is_active} />
    ),
    onRenderlocation: (item: IWarehouse) => (
      <a
        href={`https://www.google.com/maps/search/?api=1&query=${item.latitude},${item.longitude}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: 'black' }}
      >
        {t('click_here')}
      </a>
    ),
  };
  const handleViewProduct = (item: IWarehouse) => {
    router.push(`/dashboard/warehouses-and-delivery-locations/${item.id}`);
  };
  const handleImportProducts = (item: IWarehouse) => {
    router.push(`/dashboard/warehouses-and-delivery-locations/operations/import/${item.id}`);
  };
  const handleExportProducts = (item: IWarehouse) => {
    router.push(`/dashboard/warehouses-and-delivery-locations/operations/export/${item.id}`);
  };
  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading={t('warehouses')}
        links={[{}]}
        action={
          <Button
            component={RouterLink}
            href="/dashboard/warehouses-and-delivery-locations/new"
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            {t('new-warehouse')}
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
                  items={countries as ITems[]}
                  label={t('country')}
                  placeholder={t('country')}
                  name="countryId"
                  onCustomChange={(selectedCountryId: any) =>
                    createQueryString('country', selectedCountryId?.id ?? '')
                  }
                />
                <CutomAutocompleteView
                  items={cities as unknown as ITems[]}
                  label={t('city')}
                  placeholder={t('city')}
                  name="cityId"
                  isDisabled={cities === undefined || cities.length === 0}
                  onCustomChange={(selectedCityId: any) =>
                    createQueryString('city', selectedCityId?.id ?? '')
                  }
                />
                <CutomAutocompleteView
                  onCustomChange={(selectedCityId: any) =>
                    createQueryString('region', selectedCityId?.id ?? '')
                  }
                  items={regions as unknown as ITems[]}
                  label={t('region')}
                  placeholder={t('region')}
                  name="regionId"
                  isDisabled={regions === undefined || regions.length === 0}
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
        enableExportImport={false}
        tableHeaders={TABLE_HEAD}
        additionalTableProps={additionalTableProps}
        // handleFilters={handleFilters}
        filters={filters}
        enableActions
        actions={[
          {
            label: t('view-products'),
            icon: 'solar:eye-bold',
            onClick: (item: IWarehouse) => {
              handleViewProduct(item);
            },
          },
          {
            label: t('edit'),
            icon: 'solar:pen-bold',
            onClick: (item: IWarehouse) => {
              handleEditWarehouse(item);
            },
          },
          {
            label: t('edit-cities'),
            icon: 'solar:pen-bold',
            onClick: (item: IWarehouse) => {
              handleEditCities(item);
            },
          },
          {
            label: t('import-products'),
            icon: 'solar:import-bold',
            onClick: (item: IWarehouse) => {
              handleImportProducts(item);
            },
          },
          {
            label: t('export-products'),
            icon: 'solar:export-bold',
            onClick: (item: IWarehouse) => {
              handleExportProducts(item);
            },
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
interface IFilters {
  name: string;
}
function applyFilter({
  inputData,
  comparator,
  filters,
  dateError,
}: {
  inputData: IWarehouse[];
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
      (warehouse) => warehouse.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  return inputData;
}

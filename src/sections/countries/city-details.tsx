'use client';

import { useSnackbar } from 'notistack';
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
import { IRegion } from 'src/@types/regions';
import { deleteRegion } from 'src/actions/region-actions';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import SharedTable from 'src/components/shared-table';
import { useSettingsContext } from 'src/components/settings';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useTable, getComparator } from 'src/components/table';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import AddEditRegion from './add-region/add-edit-city';

// ----------------------------------------------------------------------

type Props = {
  city: ICity;
  regions: IRegion[];
};

const TABLE_HEAD = [
  { id: 'name_ar', label: 'name_ar' },
  { id: 'name_en', label: 'name_en' },
];

export default function CityDetails({ regions, city }: Props) {
  const settings = useSettingsContext();
  const { t } = useTranslate();
  const [showAddRegion, setShowAddEditCity] = useState<boolean | undefined>(false);
  const [selectedRegion, setSelectedRegion] = useState<IRegion | undefined>(undefined);
  const table = useTable({ defaultOrderBy: 'createDate' });
  const [filters, setFilters] = useState({ name: '' });
  const [regionID, setRegionID] = useState<string | undefined>(undefined);
  const confirm = useBoolean();
  const { enqueueSnackbar } = useSnackbar();
  const additionalTableProps = {
    onRendername_en: (item: IRegion) => item.name_en,
    onRendername_ar: (item: IRegion) => item.name_ar,
  };
  const dataFiltered = applyFilter({
    inputData: regions,
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
    try {
      if (typeof regionID === 'string') {
        await deleteRegion({ id: regionID, cityID: city.id as string });
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
    setRegionID(undefined);
  };
  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading={t('city_details')}
        links={[
          {
            name: t('countries'),
            href: paths.dashboard.dataManagementsGroup.countries,
          },
          {
            name: getCustomNameKeyLang(city.country.name_en, city.country.name_ar),
            href: `${paths.dashboard.dataManagementsGroup.countries}/${city.country.id}`,
          },
          {
            name: t('cities'),
            href: paths.dashboard.dataManagementsGroup.countryId(city.country.id as string),
          },
          { name: getCustomNameKeyLang(city.name_en, city.name_ar) },
          { name: t('regions') },
        ]}
        action={
          <Button
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => {
              setShowAddEditCity(true);
            }}
          >
            {t('add_region')}
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
                {city?.name_ar || t('unknown')}
              </Label>
            </Typography>
            <Typography variant="subtitle2">
              {t('Name in English')} :
              <Label sx={{ mx: 1 }} variant="soft">
                {city?.name_en || t('unknown')}
              </Label>
            </Typography>
          </Stack>
        </Box>

        <Divider sx={{ my: 3, borderStyle: 'dashed' }} />
        <Box sx={{ pb: 5 }}>
          <SharedTable
            custom_add_title={t('regions')}
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
                label: t('edit'),
                icon: 'solar:pen-bold',
                onClick: (item: IRegion) => {
                  setSelectedRegion(item);
                  setShowAddEditCity(true);
                },
              },
              {
                label: t('delete'),
                icon: 'solar:trash-bin-trash-bold',
                onClick: (item: IRegion) => {
                  confirm.onTrue();
                  setRegionID(item?.id);
                },
                sx: { color: 'error.main' },
              },
            ]}
          />
          {showAddRegion && (
            <AddEditRegion
              open={showAddRegion}
              onClose={() => {
                setShowAddEditCity(false);
                setSelectedRegion(undefined);
              }}
              selectedRegion={selectedRegion}
              city={city}
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
  inputData: IRegion[];
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

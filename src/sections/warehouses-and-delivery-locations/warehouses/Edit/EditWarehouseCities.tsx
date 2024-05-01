'use client';

import * as Yup from 'yup';
import { t } from 'i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter, usePathname, useSearchParams } from 'src/routes/hooks';

import { getCustomNameKeyLang } from 'src/utils/helperfunction';

import { ICity } from 'src/@types/cities';
import { IRegion } from 'src/@types/regions';
import { Countries } from 'src/@types/countries';
import { IWarehouse } from 'src/@types/warehouse';
import { EditWarehouseCities } from 'src/actions/warehouse-actions';

import FormProvider from 'src/components/hook-form';
import { useSnackbar } from 'src/components/snackbar';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import CutomAutocompleteView, { ITems } from 'src/components/AutoComplete/CutomAutocompleteView';
import { FORM_DEFAULT_STATE } from 'react-hook-form/dist/constants';

// ----------------------------------------------------------------------
export type ISubcategoryForm = {
  id: string;
  name_ar: string;
  name_en: string;
  logo: string;
};

type Props = {
  warehouse: IWarehouse & { name_en: string };
  countries: Countries[];
  cities: ICity[];
  regions: IRegion[];
};
export default function EditWarehouseCitiesForm({ warehouse, cities, regions, countries }: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const settings = useSettingsContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const warehouseSchema = Yup.object().shape({
    countryId: Yup.mixed<any>().required(t('country is required')),
    cityId: Yup.mixed<any>().required(t('city is required')),
    regionId: Yup.mixed<any>().required(t('region is required')),
  });

  const defaultValues = useMemo(
    () => ({
      countryId: warehouse.region.city.country_id || null,
      cityId: warehouse.region.city_id || null,
      regionId: warehouse.region_id || null,
    }),
    [warehouse]
  );

  const methods = useForm({
    resolver: yupResolver(warehouseSchema),
    defaultValues,
  });

  const {
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  useEffect(() => {
    setValue('countryId', warehouse.region.city.country);
    setValue('cityId', warehouse.region.city);
    setValue('regionId', warehouse.region);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  watch();

  const onSubmit = handleSubmit(async (data) => {
    const dataBody = {
      region_id: data.regionId?.id,
    };
    const res = await EditWarehouseCities({ dataBody, id: warehouse.id });
    if (res?.error) {
      enqueueSnackbar(`${res?.error}`, { variant: 'error' });
    } else {
      router.push(paths.dashboard.warehousesAndDeliveryLocations);
      enqueueSnackbar(t('Update success!'));
    }
  });
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      if (name === 'country') {
        setValue('cityId', null);
        setValue('regionId', null);
        params?.delete('city');
        params?.delete('region');
      } else if (name === 'city') {
        setValue('regionId', null);
        params?.delete('region');
      }
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams, setValue]
  );
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
          { name: t('edit') },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      <FormProvider methods={methods} onSubmit={onSubmit}>
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
                  items={regions as unknown as ITems[]}
                  label={t('region')}
                  placeholder={t('region')}
                  name="regionId"
                  isDisabled={regions === undefined || regions.length === 0}
                  onCustomChange={(selectedCityId: any) =>
                    createQueryString('region', selectedCityId?.id ?? '')
                  }
                />
              </Box>
              <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  {t('save')}
                </LoadingButton>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    </Container>
  );
}

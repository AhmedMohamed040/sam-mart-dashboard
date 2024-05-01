'use client';

/* eslint-disable react-hooks/exhaustive-deps */

import axios from 'axios';
import * as yup from 'yup';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';

import { getCustomNameKeyLang } from 'src/utils/helperfunction';

import { ICity } from 'src/@types/cities';
import { useTranslate } from 'src/locales';
import { IRegion } from 'src/@types/regions';
import { Countries } from 'src/@types/countries';
import { IWarehouse } from 'src/@types/warehouse';
import { newWarehouse, editWarehouse } from 'src/actions/warehouse-actions';

import { GoogleMap } from 'src/components/map';
import { useSettingsContext } from 'src/components/settings';
import FormProvider from 'src/components/hook-form/form-provider';
import { RHFTextField, RHFRadioGroup } from 'src/components/hook-form';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import CutomAutocompleteView, { ITems } from 'src/components/AutoComplete/CutomAutocompleteView';

import { Position } from 'src/types/map';

interface Prop {
  warehouse?: IWarehouse & { name_en: string };
  countries?: Countries[] | undefined;
  cities?: ICity[] | undefined;
  regions?: IRegion[] | undefined;
}
interface Address {
  add_ar: string;
  add_en: string;
}
const NewWarehouseView = ({ warehouse, countries, cities, regions }: Readonly<Prop>) => {
  const settings = useSettingsContext();
  const { t } = useTranslate();
  const { enqueueSnackbar } = useSnackbar();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentPosition, setCurrentPosition] = useState<Position | null>(
    warehouse ? { lat: warehouse?.latitude, lng: warehouse?.longitude } : null
  );
  const [address, setAddress] = useState<Address | null>(null);
  useEffect(() => {
    setAddress(null);

    const fetchAddress = async (language: string) => {
      try {
        const res = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${currentPosition?.lat},${currentPosition?.lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}&language=${language}`
        );
        return res.data.results[0].formatted_address;
      } catch (error) {
        console.error(error);
        return '';
      }
    };

    const fetchAddresses = async () => {
      const arAddress = await fetchAddress('ar');
      const enAddress = await fetchAddress('en');
      setAddress({ add_ar: arAddress, add_en: enAddress });
    };

    if (currentPosition) {
      fetchAddresses();
    }
  }, [currentPosition]);

  const schema = yup
    .object()
    .shape({
      name_ar: yup.string().required(t('Name in Arabic is required')),
      name_en: yup.string().required(t('Name in English is required')),
      country: yup
        .object()
        .shape({
          id: yup.string().required(t('Country is required')),
        })
        .required(t('country is required')),
      city: yup
        .object()
        .shape({
          id: yup.string().required(t('City is required')),
        })
        .required(t('City is required')),
      region: yup
        .object()
        .shape({
          id: yup.string().required(t('Region is required')),
        })
        .required(t('Region is required')),

      is_active: yup.boolean().required(t('this is required')),
      geo_location: yup.string().required(t('Location is required')),
    })
    .required();

  const country = searchParams?.get('country') || '';
  const region = searchParams?.get('region') || '';
  const city = searchParams?.get('city') || '';

  const formDefaultValues = {
    name_ar: warehouse ? warehouse.name : '',
    name_en: warehouse ? warehouse.name_en : '',
    city: warehouse
      ? { ...warehouse?.region?.city, name_ar: warehouse?.region?.city?.name }
      : { id: city },
    region: warehouse ? { ...warehouse?.region, name_ar: warehouse?.region?.name } : { id: region },
    country: warehouse
      ? { ...warehouse?.region?.city?.country, name_ar: warehouse?.region?.city?.country?.name }
      : { id: country },
    is_active: warehouse ? warehouse.is_active : false,
    geo_location: warehouse ? t('Location had been added') : '',
  };
  const methods = useForm({
    defaultValues: formDefaultValues,
    resolver: yupResolver(schema),
  });

  const {
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  // useEffect(() => {
  //   router.push(`${pathname}`);
  // }, []);

  const onSubmit = async (data: any) => {
    if (!currentPosition) throw Error('No geo location had been added');
    const dataBody = {
      name_ar: data?.name_ar,
      name_en: data?.name_en,
      region_id: data?.region?.id,
      latitude: currentPosition.lat.toString(),
      longitude: currentPosition.lng.toString(),
      is_active: data?.is_active,
      address_ar: address?.add_ar as string,
      address_en: address?.add_en as string,
    };
    if (address) {
      if (warehouse) {
        const res = await editWarehouse({ dataBody, id: warehouse.id });
        if (res?.error) {
          enqueueSnackbar(`${res?.error}`, { variant: 'error' });
        } else {
          enqueueSnackbar(t('edited_successfully'), {
            variant: 'success',
          });
          router.back();
        }
      } else {
        const res = await newWarehouse(dataBody);
        if (res?.error) {
          enqueueSnackbar(`${res?.error}`, { variant: 'error' });
        } else {
          enqueueSnackbar(t('created_successfully'), {
            variant: 'success',
          });
          router.push(paths.dashboard.warehousesAndDeliveryLocations);
        }
      }
    }
  };
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      if (name === 'country') {
        setValue('city', { id: '' });
        setValue('region', { id: '' });
        params?.delete('city');
        params?.delete('region');
      } else if (name === 'city') {
        setValue('region', { id: '' });
        params?.delete('region');
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams, setValue]
  );
  const LINKS = warehouse
    ? [
        {
          name: t('warehouses'),
          href: paths.dashboard.warehousesAndDeliveryLocations,
        },
        {
          name: getCustomNameKeyLang(warehouse.name_en, warehouse.name),
          href: `${paths.dashboard.warehousesAndDeliveryLocations}/${warehouse.id}`,
        },
        { name: t('edit') },
      ]
    : [
        {
          name: t('warehouses'),
          href: paths.dashboard.warehousesAndDeliveryLocations,
        },
        { name: t('new-warehouse') },
      ];
  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading={
          warehouse ? getCustomNameKeyLang(warehouse.name_en, warehouse.name) : t('warehouses')
        }
        links={LINKS}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Card sx={{ p: 3, ml: 3, mb: 1 }}>
          <Grid container spacing={2}>
            {/* Names */}
            <Grid item xs={12} md={6}>
              <RHFTextField
                fullWidth
                name="name_ar"
                label={t('Name in Arabic')}
                placeholder={t('Name in Arabic')}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <RHFTextField
                fullWidth
                name="name_en"
                label={t('Name in English')}
                placeholder={t('Name in English')}
              />
            </Grid>

            {/* Location Fields */}
            <Grid item xs={12} md={6}>
              <CutomAutocompleteView
                items={countries as ITems[]}
                label={t('country')}
                placeholder={t('country')}
                name="country"
                onCustomChange={(selectedCountryId: any) =>
                  createQueryString('country', selectedCountryId?.id ?? '')
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CutomAutocompleteView
                items={cities as unknown as ITems[]}
                label={t('city')}
                placeholder={t('city')}
                name="city"
                isDisabled={!cities || cities.length === 0}
                onCustomChange={(selectedCityId: any) =>
                  createQueryString('city', selectedCityId?.id ?? '')
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CutomAutocompleteView
                onCustomChange={(selectedCityId: any) =>
                  createQueryString('region', selectedCityId?.id ?? '')
                }
                items={regions as unknown as ITems[]}
                label={t('region')}
                placeholder={t('region')}
                name="region"
                isDisabled={!regions || regions.length === 0}
              />
            </Grid>
            {/* TODO: get location */}
            {/* <Grid item xs={12} md={6}>
              <RHFTextField
                fullWidth
                name="geo_location"
                label={t('Geographical location')}
                // placeholder={t('Geographical location')}
                placeholder={t('Click on map to add location')}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid> */}

            {/* Is Active Field */}
            <Grid item xs={12} md={6}>
              <RHFRadioGroup
                row
                name="is_active"
                options={[
                  { label: t('Active'), value: true },
                  { label: t('Disabled'), value: false },
                ]}
                label={t('state')}
              />
            </Grid>
          </Grid>
        </Card>
        <Card sx={{ p: 3, ml: 3, mb: 1 }}>
          <Box sx={{ height: 'min(30rem, 90vw)', mb: 1 }}>
            <GoogleMap
              defaultPosition={currentPosition || undefined}
              setCurrentPosition={(p) => {
                setCurrentPosition(p);
                setValue('geo_location', t('Location had been added'));
              }}
            />
          </Box>
          {/* Address */}
          {/* {true ? <Typography>adress</Typography> : null} */}
          {/* Map Error Msg */}
          {errors?.geo_location?.message && !currentPosition ? (
            <Typography variant="subtitle1" color="error">
              {t('map_error')}
            </Typography>
          ) : null}
          {/* Submit Button */}
          <Box marginInlineStart="auto" marginTop={2} width="fit-content">
            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              {!warehouse ? t('add') : t('edit')}
            </LoadingButton>
          </Box>
        </Card>
      </FormProvider>
    </Container>
  );
};

export default NewWarehouseView;

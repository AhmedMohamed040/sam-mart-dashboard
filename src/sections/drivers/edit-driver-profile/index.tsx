'use client';

import * as Yup from 'yup';
import { toFormData } from 'axios';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { yupResolver } from '@hookform/resolvers/yup';

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { fDate } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';
import { editDriverProfile } from 'src/actions/drivers-dashboard-actions';
import { City, Region, Country, SingleDriver } from 'src/@types/dashboard-drivers';

import FormProvider from 'src/components/hook-form/form-provider';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import DriverData from './driver-data';
import VehicleData from './vehicle-data';
import EditDriverProfileActions from './actions';

interface Props {
  countries: Country[];
  driver: SingleDriver;
  cities: City[] | [];
  regions: Region[] | [];
}
const EditDriverProfile = ({ driver, countries, cities, regions }: Props) => {
  const { t } = useTranslate();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const defaultValues: DefTypes = {
    avatarFile: driver?.avatar || null,
    username: driver?.username || '',
    id_card_number: driver?.idCard?.id_card_number || '',
    id_card_image: driver?.idCard?.id_card_image || null,
    phone: driver?.phone || '',
    email: driver?.email || '',
    birth_date: driver?.birth_date ? new Date(driver.birth_date) : new Date(),
    country_id: driver?.address?.country?.id || '',
    city_id: driver?.address?.city?.id || '',
    region_id: driver?.address?.region?.id || '',
    created_at: driver?.created_at ? new Date(driver.created_at) : new Date(),
    vehicle_type: driver?.vehicle?.vehicle_type || '',
    vehicle_color: driver?.vehicle?.vehicle_color || '',
    license_number: driver?.vehicle?.license_number || '',
    license_image: driver?.vehicle?.license_image || null,
  };
  const validationSchema = Yup.object().shape({
    avatarFile: Yup.mixed<any>().required(t('driver_picture_is_required')),
    username: Yup.string().required(t('driver_username_is_required')),
    id_card_number: Yup.string()
      .min(10, t('atleast_10_digits'))
      .matches(/^\d{10,}$/, t('atleast_10_digits_and_be_a_number'))
      .required(t('driver_id_is_required')),
    id_card_image: Yup.mixed<any>().required(t('driver_picture_is_required')),
    phone: Yup.string().required(t('phone_is_required')),
    email: Yup.string().email(t('invalid_email')).required(t('email_is_required')),
    birth_date: Yup.date().max(new Date(), t('invalid_date')).required(t('date_is_required')),
    country_id: Yup.string().required(t('country_is_required')),
    city_id: Yup.string().required(t('city_is_required')),
    region_id: Yup.string().required(t('region_is_required')),
    created_at: Yup.date().max(new Date(), t('invalid_date')).required(t('date_is_required')),
    vehicle_type: Yup.string().required(t('vehicle_type_is_required')),
    vehicle_color: Yup.string().required(t('vehicle_color_is_required')),
    license_number: Yup.string().required(t('license_number_is_required')),
    license_image: Yup.mixed<any>().nullable().required(t('license_image_is_required')),
  });
  const methods = useForm({
    defaultValues,
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
  });

  const onSubmit = methods.handleSubmit(async (data) => {
    const formData = new FormData();

    const reqBody = {
      driver_id: driver?.id,
      ...data,
      birth_date: fDate(data?.birth_date),
      created_at: fDate(data?.created_at),
    };
    toFormData(reqBody, formData);

    if (typeof formData.get('avatarFile') === 'string') formData.delete('avatarFile');
    if (typeof formData.get('license_image') === 'string') formData.delete('license_image');
    if (typeof formData.get('id_card_image') === 'string') formData.delete('id_card_image');

    const res = await editDriverProfile(formData);

    if (res?.error) {
      enqueueSnackbar(res.error, { variant: 'error' });
    } else {
      enqueueSnackbar(t('driver_profile_updated_successfully'));
      router.back();
    }
  });
  return (
    <Container maxWidth="xl">
      <CustomBreadcrumbs
        heading={t('edit_driver_profile')}
        links={[
          {
            name: t('drivers'),
            href: paths.dashboard.drivers,
          },
          {
            name: driver?.username ? driver.username : t('driver_name'),
            href: `${paths.dashboard.drivers}/${driver.id}/details`,
          },
          {
            name: t('edit'),
          },
        ]}
        sx={{ pb: 3, ml: 3, mb: 1 }}
      />
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Stack gap={4}>
          <DriverData countries={countries} cities={cities} regions={regions} />
          <VehicleData />
        </Stack>
        <EditDriverProfileActions />
      </FormProvider>
    </Container>
  );
};

export default EditDriverProfile;

interface DefTypes {
  avatarFile: File | null | string;
  username: string;
  id_card_number: string;
  id_card_image: File | null | string;
  phone: string;
  email: string;
  birth_date: Date;
  country_id: string;
  city_id: string;
  region_id: string;
  created_at: Date;
  vehicle_type: string;
  vehicle_color: string;
  license_number: string;
  license_image: File | null | string;
}

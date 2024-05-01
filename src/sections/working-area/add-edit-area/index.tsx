'use client';

import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { yupResolver } from '@hookform/resolvers/yup';

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useLocales, useTranslate } from 'src/locales';
import { setWorkArea, editExistingWorkArea } from 'src/actions/working-area';
import type { MapData, CityOption, WorkingArea } from 'src/@types/working-area';

import FormProvider from 'src/components/hook-form/form-provider';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import WorkingAreaMap from './map';
import AddNewAreaInputs from './inputs';
import AddNewAreaActions from './actions';

const AddEditWorkingArea = ({
  cities,
  workArea,
}: {
  cities: CityOption[];
  workArea?: WorkingArea;
}) => {
  const { currentLang } = useLocales();
  const { t } = useTranslate();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const InitialMapData = workArea?.id
    ? {
        coords: {
          lat: workArea.latitude,
          lng: workArea.longitude,
        },
        address: {
          add_ar: workArea.address,
          add_en: workArea.address,
        },
      }
    : null;
  const [mapData, getMapData] = useState<MapData | null>(InitialMapData);

  const breadCrumbsLinks = useMemo(
    () =>
      workArea?.name
        ? [
            {
              name: t('working_areas'),
              href: paths.dashboard.workingArea,
            },
            {
              name: workArea.name,
            },
            { name: t('edit') },
          ]
        : [
            {
              name: t('working_areas'),
              href: paths.dashboard.workingArea,
            },
            { name: t('add_working_area') },
          ],
    [t, workArea?.name]
  );
  const yupSchema = Yup.object().shape({
    geo_location: Yup.string(),
    areaName: Yup.string().required(t('area_name_is_required')).max(50, t("can't_exceed_50_chars")),
    availableSpace: Yup.number()
      .required(t('available_space_is_required'))
      .positive(t('should_be_positive'))
      .integer(t('should_be_an_integer')),
    status: Yup.string().required(t('status_is_required')),
    city: Yup.string().required(t('city_is_required')),
    address: Yup.string().required(t('please_pick_a_location_on_the_map')),
  });
  // ONLY USED IF EDITING EXISTING WORKING-AREA
  const getStatusInString = (status: boolean) => (status ? 'active' : 'disabled');
  const defaultValues = {
    areaName: workArea?.name ? workArea.name : '',
    availableSpace: workArea?.range ? workArea.range : 0,
    status: workArea?.is_active ? getStatusInString(workArea.is_active) : 'active',
    city: workArea?.city_id ? workArea.city_id : '',
    address: workArea?.address ? workArea.address : '',
  };
  const methods = useForm({ resolver: yupResolver(yupSchema), defaultValues });
  const { handleSubmit, reset } = methods;
  const onSubmit = handleSubmit(async (data) => {
    if (!mapData) {
      enqueueSnackbar(t('please_pick_a_location_on_the_map'), {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'center',
        },
      });
      return;
    }
    const reqBody = {
      latitude: mapData.coords.lat,
      longitude: mapData.coords.lng,
      range: data.availableSpace,
      name: data.areaName,
      address: currentLang.value === 'en' ? mapData.address.add_en : mapData.address.add_ar,
      city_id: data.city,
      is_active: data.status === 'active',
    };

    // IF workArea was passed ( EDIT MODE )
    if (workArea?.id) {
      const res = await editExistingWorkArea({ ...reqBody, id: workArea.id });
      if (res?.error) {
        enqueueSnackbar(res?.error, { variant: 'error' });
      } else {
        reset();
        enqueueSnackbar(t('working_area_was_updated_successfully'));
        router.push('/dashboard/working-area');
      }
    } else {
      // IF NO WORK-AREA ( CREATE MODE )
      const res = await setWorkArea(reqBody);
      if (res?.error) {
        enqueueSnackbar(res?.error, { variant: 'error' });
      } else {
        reset();
        enqueueSnackbar(t('new_wokring_area_was_created'));
        router.push('/dashboard/working-area');
      }
    }
  });
  return (
    <Container maxWidth="xl">
      <CustomBreadcrumbs
        heading={workArea ? workArea.name : t('add_working_area')}
        links={breadCrumbsLinks}
        sx={{
          mb: 1,
        }}
      />
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Stack gap={4}>
          <WorkingAreaMap
            getMapData={getMapData}
            defaultPos={workArea?.id ? { lat: workArea.latitude, lng: workArea.longitude } : null}
          />
          <AddNewAreaInputs cities={cities} />
          <AddNewAreaActions />
        </Stack>
      </FormProvider>
    </Container>
  );
};

export default AddEditWorkingArea;

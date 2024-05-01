import { useFormContext } from 'react-hook-form';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import FormLabel from '@mui/material/FormLabel';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';

import uuidv4 from 'src/utils/uuidv4';
import { getCustomNameKeyLang } from 'src/utils/helperfunction';

import { useTranslate } from 'src/locales';
import { CityOption } from 'src/@types/working-area';
import { Country } from 'src/@types/dashboard-drivers';
import { getCities } from 'src/actions/drivers-dashboard-actions';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { RHFSelect, RHFTextField, RHFRadioGroup, RHFUploadAvatar } from 'src/components/hook-form';

const EmployeeData = ({
  countries,
  isEditing,
}: {
  countries: Country[] | [];
  isEditing: boolean;
}) => {
  const [cities, setCities] = useState([]);
  const { t } = useTranslate();
  const { getValues, watch, setValue } = useFormContext();
  const statusOptions = [
    {
      label: t('activate'),
      value: true,
    },
    {
      label: t('deactivate'),
      value: false,
    },
  ];
  const GENDER = [
    { id: uuidv4(), label: t('male'), value: 'male' },
    { id: uuidv4(), label: t('female'), value: 'female' },
  ];
  const countryVal = getValues('employeeData.country_id');
  watch('employeeData.country_id');
  useEffect(() => {
    const getReqCities = async (countryId: string) => {
      try {
        const res = await getCities(countryId);
        setCities(res);
      } catch (error) {
        setValue('employeeData.city_id', '');
      }
    };

    if (countryVal) {
      getReqCities(countryVal);
    } else {
      setValue('employeeData.city_id', '');
    }
  }, [countryVal, setValue]);

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('employeeData.avatar_file', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );
  return (
    <Box>
      <CustomBreadcrumbs
        heading={
          isEditing
            ? getCustomNameKeyLang(
                getValues('employeeData.name_en'),
                getValues('employeeData.name_ar')
              )
            : t('add_employee')
        }
        links={
          isEditing
            ? [
                { name: t('employees'), href: paths.dashboard.employees },
                {
                  name: getCustomNameKeyLang(
                    getValues('employeeData.name_en'),
                    getValues('employeeData.name_ar')
                  ),
                },
                { name: t('edit') },
              ]
            : [{}]
        }
      />
      <Stack
        direction="row"
        flexWrap="wrap"
        gap={4}
        justifyContent="space-between"
        alignItems="center"
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          md: 'repeat(2, 1fr)',
        }}
      >
        <Box sx={{ mb: 5 }} gridColumn={{ xs: 'span 1', md: 'span 2' }}>
          <RHFUploadAvatar name="employeeData.avatar_file" maxSize={3145728} onDrop={handleDrop} />
        </Box>
        <Stack gap={4}>
          <Stack
            alignItems="center"
            gap={2}
            display="grid"
            gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: '1fr 1.5fr' }}
          >
            <FormLabel htmlFor="employee_name_ar" sx={{ cursor: 'pointer' }}>
              <Typography>{t('employee_name_ar')}</Typography>
            </FormLabel>
            <RHFTextField
              id="employee_name_ar"
              autoComplete="off"
              autoCorrect="off"
              name="employeeData.name_ar"
            />
          </Stack>
          <Stack
            alignItems="center"
            gap={2}
            display="grid"
            gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: '1fr 1.5fr' }}
          >
            <FormLabel htmlFor="employee_name_en" sx={{ cursor: 'pointer' }}>
              <Typography>{t('employee_name_en')}</Typography>
            </FormLabel>
            <RHFTextField
              id="employee_name_en"
              autoComplete="off"
              autoCorrect="off"
              name="employeeData.name_en"
            />
          </Stack>
          <Stack
            alignItems="center"
            gap={2}
            display="grid"
            gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: '1fr 1.5fr' }}
          >
            <FormLabel htmlFor="phone" sx={{ cursor: 'pointer' }}>
              <Typography>{t('phone')}</Typography>
            </FormLabel>
            <RHFTextField
              id="phone"
              autoComplete="off"
              autoCorrect="off"
              name="employeeData.phone"
              style={{ direction: 'ltr' }}
              sx={{ '& input': { textAlign: 'left' } }}
            />
          </Stack>
          <Stack
            alignItems="center"
            gap={2}
            display="grid"
            gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: '1fr 1.5fr' }}
          >
            <FormLabel htmlFor="email" sx={{ cursor: 'pointer' }}>
              <Typography>{t('email')}</Typography>
            </FormLabel>
            <RHFTextField
              id="email"
              autoComplete="off"
              autoCorrect="off"
              name="employeeData.email"
            />
          </Stack>
          <Stack
            alignItems="center"
            gap={2}
            display="grid"
            gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: '1fr 1.5fr' }}
          >
            <FormLabel>
              <Typography>{t('gender')}</Typography>
            </FormLabel>
            <RHFSelect
              native
              name="employeeData.gender"
              InputLabelProps={{ shrink: true }}
              sx={{ flexGrow: 1 }}
            >
              {GENDER.map((g) => (
                <option key={g.id} value={g.value}>
                  {g.label}
                </option>
              ))}
            </RHFSelect>
          </Stack>
          <Stack
            alignItems="center"
            gap={2}
            display="grid"
            gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: '1fr 1.5fr' }}
          >
            <FormLabel htmlFor="qualification" sx={{ cursor: 'pointer' }}>
              <Typography>{t('qualification')}</Typography>
            </FormLabel>
            <RHFTextField
              id="qualification"
              autoComplete="off"
              autoCorrect="off"
              name="employeeData.qualification"
            />
          </Stack>
        </Stack>

        <Stack gap={4}>
          <Stack
            alignItems="center"
            gap={2}
            display="grid"
            gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: '1fr 3fr' }}
          >
            <FormLabel>
              <Typography>{t('country')}</Typography>
            </FormLabel>
            <RHFSelect
              native
              name="employeeData.country_id"
              InputLabelProps={{ shrink: true }}
              sx={{ flexGrow: 1 }}
            >
              <option value="" />
              {countries.map((country) => (
                <option key={country.id} value={country.id}>
                  {getCustomNameKeyLang(country.name_en, country.name_ar)}
                </option>
              ))}
            </RHFSelect>
          </Stack>
          <Stack
            alignItems="center"
            gap={2}
            display="grid"
            gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: '1fr 3fr' }}
          >
            <FormLabel>
              <Typography>{t('city')}</Typography>
            </FormLabel>
            <RHFSelect
              native
              name="employeeData.city_id"
              InputLabelProps={{ shrink: true }}
              sx={{ flexGrow: 1 }}
              disabled={cities.length === 0 || countryVal === ''}
              variant={cities.length === 0 || countryVal === '' ? 'filled' : 'outlined'}
            >
              <option value="" />
              {cities.map((city: CityOption) => (
                <option key={city.id} value={city.id}>
                  {getCustomNameKeyLang(city.name_en, city.name_ar)}
                </option>
              ))}
            </RHFSelect>
          </Stack>
          <Stack
            alignItems="center"
            gap={2}
            display="grid"
            gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: '1fr 3fr' }}
          >
            <FormLabel>
              <Typography>{t('status')}</Typography>
            </FormLabel>
            <RHFRadioGroup
              row
              name="employeeData.is_active"
              options={statusOptions}
              sx={{ flexGrow: 1 }}
            />
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};

export default EmployeeData;

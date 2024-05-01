import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import FormLabel from '@mui/material/FormLabel';
import Typography from '@mui/material/Typography';

import { useLocales, useTranslate } from 'src/locales';
import type { CityOption } from 'src/@types/working-area';

import { RHFSelect, RHFTextField, RHFRadioGroup } from 'src/components/hook-form';

const AddNewAreaInputs = ({ cities }: { cities: CityOption[] }) => {
  const { currentLang } = useLocales();
  const { t } = useTranslate();
  const statusOptions = [
    {
      label: t('activate'),
      value: 'active',
    },
    {
      label: t('deactivate'),
      value: 'disabled',
    },
  ];
  return (
    <Stack direction="row" flexWrap="wrap" gap={4}>
      <Stack flexGrow={1} gap={4}>
        <Stack flexDirection="row" alignItems="center">
          <FormLabel htmlFor="area-name" sx={{ width: '30%' }}>
            <Typography>{t('area_name')}</Typography>
          </FormLabel>
          <RHFTextField
            autoComplete="off"
            autoCorrect="off"
            id="area-name"
            name="areaName"
            placeholder={t('area_name')}
            sx={{ flexGrow: 1 }}
          />
        </Stack>
        <Stack flexDirection="row" alignItems="center">
          <FormLabel htmlFor="available-space" sx={{ width: '30%' }}>
            <Typography>{t('available_space')}</Typography>
          </FormLabel>
          <RHFTextField
            autoComplete="off"
            autoCorrect="off"
            id="available-space"
            type="number"
            name="availableSpace"
            placeholder={t('available_space')}
            sx={{ flexGrow: 1 }}
          />
        </Stack>
        <Stack flexDirection="row" alignItems="center">
          <FormLabel sx={{ width: '30%' }}>
            <Typography>{t('status')}</Typography>
          </FormLabel>
          <RHFRadioGroup row name="status" options={statusOptions} sx={{ flexGrow: 1 }} />
        </Stack>
      </Stack>
      <Stack flexGrow={1} gap={4}>
        <Stack flexDirection="row" alignItems="center">
          <FormLabel sx={{ width: '30%' }}>
            <Typography>{t('address')}</Typography>
          </FormLabel>
          <RHFTextField
            multiline
            aria-readonly
            name="address"
            placeholder={t('address')}
            sx={{ flexGrow: 1 }}
            disabled
          />
        </Stack>
        <Stack flexDirection="row" alignItems="center">
          <FormLabel sx={{ width: '30%' }}>
            <Typography>{t('city')}</Typography>
          </FormLabel>
          <RHFSelect
            placeholder={t('city')}
            name="city"
            InputLabelProps={{ shrink: true }}
            sx={{ flexGrow: 1 }}
          >
            {cities.map((city: CityOption) => (
              <MenuItem key={city.id} value={city.id}>
                {currentLang.value === 'en' ? city.name_en : city.name_ar}
              </MenuItem>
            ))}
          </RHFSelect>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default AddNewAreaInputs;

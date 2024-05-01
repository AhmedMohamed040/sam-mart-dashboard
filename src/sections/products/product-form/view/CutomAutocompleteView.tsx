'use client';


import { getNameKeyLang } from 'src/utils/helperfunction';

import { Units } from 'src/@types/units';
import { useTranslate } from 'src/locales';

import { RHFAutocomplete } from 'src/components/hook-form';

interface IProps {
  items: Units[];
}

function CutomAutocompleteView({ items }: IProps) {
  const {t} = useTranslate();
  return (
    <RHFAutocomplete
      name="measurements"
      label={t("units")}
      placeholder={t("Choose a Unit")}
      fullWidth
      options={items}
      getOptionLabel={(option) =>
        (option as Units)[getNameKeyLang()] ?? (option as Units)?.name_en ?? ''
      }
      isOptionEqualToValue={(option, value) => option.id === value.id}
      renderOption={(props, unit) => (
        <li {...props} key={unit.id} value={unit.id}>
          {unit[getNameKeyLang()] ?? (unit as Units)?.name_en ?? ''}
        </li>
      )}
    />
  );
}

export default CutomAutocompleteView;

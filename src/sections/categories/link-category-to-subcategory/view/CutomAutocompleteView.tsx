'use client';


import { getNameKeyLang } from 'src/utils/helperfunction';

import { useTranslate } from 'src/locales';
import { ICategory } from 'src/@types/categories';
import { SubCategories } from 'src/@types/sub-categories';

import { RHFAutocomplete } from 'src/components/hook-form';

interface IProps {
  items: SubCategories[] | ICategory[];
}

function CutomAutocompleteView({ items: subcategories }: IProps) {
  const { t } = useTranslate();
  return (
    <RHFAutocomplete
      name="subcategory_id"
      label={t('subcategory')}
      placeholder={t('choose a subcategory')}
      fullWidth
      options={subcategories}
      getOptionLabel={(option) =>
        (option as ICategory)[getNameKeyLang()] ?? (option as ICategory)?.name ?? ''
      }
      isOptionEqualToValue={(option, value) => option.id === value.id}
      renderOption={(props, category) => (
        <li {...props} key={category.id} value={category.id}>
          {category[getNameKeyLang()] ?? (category as ICategory)?.name ?? ''}
        </li>
      )}
    />
  );
}

export default CutomAutocompleteView;

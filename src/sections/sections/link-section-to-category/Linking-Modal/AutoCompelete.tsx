'use server';

import CutomAutocompleteView from './CutomAutocompleteView';

interface props {
  fetchItems: ({ filters }: { filters?: string }) => Promise<any>;
  label: string;
  placeholder: string;
  name: string;
  search?: string;
  searchQuery?: string;
}

export default async function CustomAutoCompelete({
  fetchItems,
  label,
  placeholder,
  name,
  search,
  searchQuery,
}: props) {
  const res = await fetchItems({
    filters: search,
  });
  return (
    <CutomAutocompleteView
      searchQuery={searchQuery}
      items={res?.data?.data}
      label={label}
      placeholder={placeholder}
      name={name}
    />
  );
}

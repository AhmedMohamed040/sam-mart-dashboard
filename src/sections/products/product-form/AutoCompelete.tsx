'use server';

import CutomAutocompleteView from './view/CutomAutocompleteView';

interface props {
  fetchItems: () => Promise<any>;
}

export default async function CustomAutoCompelete({ fetchItems }: props) {
  const res = await fetchItems();
  return <CutomAutocompleteView items={res?.data?.data} />;
}

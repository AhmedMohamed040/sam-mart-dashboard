import { fetchSingleSubcategory } from 'src/actions/sub-categories-actions';

import { SubcategoryView } from 'src/sections/subcategory/sub-categories-form/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Edit Subcategory',
};

type props = {
  params: {
    subcategoryId: string;
  };
};
interface Headers {
  subcategoryId: string;
}
export default async function Page({ params }: props) {
  const headers: Headers = {
    subcategoryId: params.subcategoryId,
  };
  const data = await fetchSingleSubcategory(headers);
  return <SubcategoryView subcategory={data} />;
}

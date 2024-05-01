import { fetchSingleCategory } from 'src/actions/categories-actions';

import { CategoryCreateView } from 'src/sections/categories/category-form/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Edit Category',
};

type Props = {
  params: {
    categoryId: string;
  };
};
type Headers = {
  categoryId: string;
};

export default async function Page({ params }: Props) {
  const headers: Headers = {
    categoryId: params.categoryId,
  };
  const data = await fetchSingleCategory(headers);
  return <CategoryCreateView category={data} />;
}

import { fetchSubCategories } from 'src/actions/sub-categories-actions';

import SubCategoriesView from 'src/sections/subcategory/view';
// ----------------------------------------------------------------------

export const metadata = {
  title: 'Subcategories',
};

type props = {
  searchParams: { [key: string]: string | string[] | undefined };
};
export default async function Page({ searchParams }: Readonly<props>) {
  const page = typeof searchParams?.page === 'string' ? Number(searchParams?.page) : 1;
  const limit = typeof searchParams?.limit === 'string' ? Number(searchParams?.limit) : 5;
  const search = typeof searchParams?.search === 'string' ? searchParams?.search : '';
  const res = await fetchSubCategories({
    page,
    limit,
    filters: search,
  });
  return <SubCategoriesView categories={res?.data?.data} count={res?.data?.meta?.total} />;
}

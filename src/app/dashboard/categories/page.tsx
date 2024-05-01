import { fetchCategories } from 'src/actions/categories-actions';

import CategoriesView from 'src/sections/categories/view';
// ----------------------------------------------------------------------

export const metadata = {
  title: 'categories',
};

type props = {
  searchParams: { [key: string]: string | string[] | undefined };
};
export default async function Page({ searchParams }: Readonly<props>) {
  const page = typeof searchParams?.page === 'string' ? Number(searchParams?.page) : 1;
  const limit = typeof searchParams?.limit === 'string' ? Number(searchParams?.limit) : 5;
  const search = typeof searchParams?.search === 'string' ? searchParams?.search : '';
  const res = await fetchCategories({
    page,
    limit,
    filters: search,
  });
  return <CategoriesView categories={res?.data?.data} count={res?.data?.meta?.total} />;
}

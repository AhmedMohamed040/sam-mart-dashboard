import { fetchBanars } from 'src/actions/banars-actions';

import BanarsView from 'src/sections/banars/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Banars',
};

type props = {
  searchParams: { [key: string]: string | string[] | undefined };
};
export default async function Page({ searchParams }: Readonly<props>) {
  const page = typeof searchParams?.page === 'string' ? Number(searchParams?.page) : 1;
  const limit = typeof searchParams?.limit === 'string' ? Number(searchParams?.limit) : 5;
  const search = typeof searchParams?.search === 'string' ? searchParams?.search : '';
  const res = await fetchBanars({
    page,
    limit,
    filters: search,
  });
  return <BanarsView banars={res?.data?.data} count={res?.data?.meta?.total} />;
}

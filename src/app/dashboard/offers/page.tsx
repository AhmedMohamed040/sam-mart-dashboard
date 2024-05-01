import { fetchOffers } from 'src/actions/offers-actions';

import OffersView from 'src/sections/offers/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Offers',
};

type props = {
  searchParams: { [key: string]: string | string[] | undefined };
};
export default async function Page({ searchParams }: Readonly<props>) {
  const page = typeof searchParams?.page === 'string' ? Number(searchParams?.page) : 1;
  const limit = typeof searchParams?.limit === 'string' ? Number(searchParams?.limit) : 5;
  const search = typeof searchParams?.search === 'string' ? searchParams?.search : '';
  const res = await fetchOffers({
    page,
    limit,
    search,
  });

  return <OffersView offers={res?.data?.data?.data} count={res?.data?.data?.meta?.itemCount} />;
}

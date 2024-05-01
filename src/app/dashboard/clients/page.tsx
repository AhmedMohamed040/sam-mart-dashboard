import { fetchClients, fetchClientsCardsData } from 'src/actions/clients-actions';

import ClientsView from 'src/sections/clients/view';
// ----------------------------------------------------------------------

export const metadata = {
  title: 'Clients',
};

type props = {
  searchParams: { [key: string]: string | string[] | undefined };
};
export default async function Page({ searchParams }: Readonly<props>) {
  const page = typeof searchParams?.page === 'string' ? Number(searchParams?.page) : 1;
  const limit = typeof searchParams?.limit === 'string' ? Number(searchParams?.limit) : 5;
  const search = typeof searchParams?.search === 'string' ? searchParams?.search : '';
  const status = typeof searchParams?.status === 'string' ? searchParams?.status : '';
  const created_at = typeof searchParams?.created_at === 'string' ? searchParams?.created_at : '';

  const res = await fetchClients({
    page,
    limit,
    filters: search,
    created_at,
    status: status === 'total' ? '' : status,
  });
  const details = await fetchClientsCardsData();

  return (
    <ClientsView
      clients={res?.data?.data?.data}
      count={res?.data?.data?.meta?.itemCount}
      cardsData={details?.data?.data}
    />
  );
}

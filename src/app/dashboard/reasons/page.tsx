import { fetchReasons } from 'src/actions/reasons-action';

import ReasonsView from 'src/sections/reasons/view';

export const metadata = {
  title: 'Reasons',
};
type props = {
  searchParams: { [key: string]: string | string[] | undefined };
};
export default async function Page({ searchParams }: Readonly<props>) {
  const page = typeof searchParams?.page === 'string' ? Number(searchParams?.page) : 1;
  const limit = typeof searchParams?.limit === 'string' ? Number(searchParams?.limit) : 5;
  const type = typeof searchParams?.type === 'string' && searchParams?.type?.length > 0 ? searchParams?.type : 'SUPPORT_TICKET';
  const search = typeof searchParams?.search === 'string' ? searchParams?.search : undefined;
  const reasons = await fetchReasons({ page, limit, type,search });
  return <ReasonsView reasons={reasons?.data} type={type} count={reasons?.meta?.total} />;
}

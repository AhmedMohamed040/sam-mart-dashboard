import { fetchCountries } from 'src/actions/countries';
import { fetchCities } from 'src/actions/cities-actions';
import { fetchRegions } from 'src/actions/region-actions';
import { fetchWarehouses } from 'src/actions/warehouse-actions';

import WareHouseView from 'src/sections/warehouses-and-delivery-locations/warehouses/view';
// ----------------------------------------------------------------------

export const metadata = {
  title: 'WareHouse',
};

type props = {
  searchParams: { [key: string]: string | string[] | undefined };
};
export default async function Page({ searchParams }: Readonly<props>) {
  const page = typeof searchParams?.page === 'string' ? Number(searchParams?.page) : 1;
  const limit = typeof searchParams?.limit === 'string' ? Number(searchParams?.limit) : 5;
  const search = typeof searchParams?.search === 'string' ? searchParams?.search : '';
  const country_id = typeof searchParams?.country === 'string' ? searchParams?.country : '';
  const city_id = typeof searchParams?.city === 'string' ? searchParams?.city : '';
  const region_id = typeof searchParams?.region === 'string' ? searchParams?.region : '';
  const res = await fetchWarehouses({
    page,
    limit,
    country_id,
    city_id,
    region_id,
    search,
    staticLang: 'ar',
  });
  const items = [await fetchCountries()];
  if (country_id) items.push(await fetchCities({ country_id }));
  if (city_id) items.push(await fetchRegions({ city_id }));

  return (
    <WareHouseView
      warehouses={res?.data}
      count={res?.meta.total}
      countries={items[0]?.data?.data}
      cities={items[1]?.data}
      regions={items[2]}
    />
  );
}

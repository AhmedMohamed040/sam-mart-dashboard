import { fetchCountries } from 'src/actions/countries';
import { fetchCities } from 'src/actions/cities-actions';
import { fetchRegions } from 'src/actions/region-actions';

import NewWarehouseView from 'src/sections/warehouses-and-delivery-locations/warehouses/new-warehouse/view';

type props = {
  searchParams: { [key: string]: string | string[] | undefined };
};
export default async function NewWarehouse({ searchParams }: Readonly<props>) {
  const country_id = typeof searchParams?.country === 'string' ? searchParams?.country : '';
  const city_id = typeof searchParams?.city === 'string' ? searchParams?.city : '';
  const items = [await fetchCountries()];
  if (country_id) items.push(await fetchCities({ country_id }));
  if (city_id) items.push(await fetchRegions({ city_id }));

  return (
    <NewWarehouseView countries={items[0]?.data?.data} cities={items[1]?.data} regions={items[2]} />
  );
}

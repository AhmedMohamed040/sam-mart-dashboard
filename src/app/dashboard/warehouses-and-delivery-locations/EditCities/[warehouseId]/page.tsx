import { fetchCountries } from 'src/actions/countries';
import { fetchCities } from 'src/actions/cities-actions';
import { fetchRegions } from 'src/actions/region-actions';
import { fetchWarehouses } from 'src/actions/warehouse-actions';

import EditWarehouseCitiesForm from 'src/sections/warehouses-and-delivery-locations/warehouses/Edit/EditWarehouseCities';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Edit Warehouse Cities',
};

type props = {
  params: {
    warehouseId: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function Page({ params, searchParams }: props) {
  const { warehouseId } = params;
  const page = typeof searchParams?.page === 'string' ? Number(searchParams?.page) : 1;
  const limit = typeof searchParams?.limit === 'string' ? Number(searchParams?.limit) : 1;
  const search = typeof searchParams?.search === 'string' ? searchParams?.search : '';
  const res = await fetchWarehouses({ page, limit, search, warehouseId });
  const country_id =
    typeof searchParams?.country === 'string'
      ? searchParams?.country
      : res.data[0]?.region?.city?.country_id;
  const city_id =
    typeof searchParams?.city === 'string' ? searchParams?.city : res.data[0]?.region?.city_id;
  const items = [await fetchCountries()];
  if (country_id) items.push(await fetchCities({ country_id }));
  if (city_id) items.push(await fetchRegions({ city_id }));
  return (
    <EditWarehouseCitiesForm
      warehouse={res.data[0] ?? []}
      countries={items[0]?.data?.data}
      cities={items[1]?.data}
      regions={items[2]}
    />
  );
}

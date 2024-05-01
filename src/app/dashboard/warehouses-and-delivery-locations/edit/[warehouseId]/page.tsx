/* eslint-disable no-nested-ternary */
import { fetchCountries } from 'src/actions/countries';
import { fetchCities } from 'src/actions/cities-actions';
import { fetchRegions } from 'src/actions/region-actions';
import { fetchSingleWarehouse } from 'src/actions/warehouse-actions';

import NewWarehouseView from 'src/sections/warehouses-and-delivery-locations/warehouses/new-warehouse/view';

export const metadata = {
  title: 'Edit Warehouse',
};

type props = {
  params: {
    warehouseId: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
};
export default async function NewWarehouse({ searchParams, params }: Readonly<props>) {
  const { warehouseId } = params;
  const warehouse = (await fetchSingleWarehouse(warehouseId)).data[0];

  // const country_id = typeof searchParams?.country === 'string' ? searchParams?.country : '';
  // const city_id = typeof searchParams?.city === 'string' ? searchParams?.city : '';

  const country_id = searchParams?.country
    ? searchParams?.country
    : warehouse?.region?.city?.country_id
      ? warehouse?.region?.city?.country_id
      : '';
  const city_id = searchParams?.city
    ? searchParams?.city
    : warehouse?.region?.city_id
      ? warehouse?.region?.city_id
      : '';
  // const region_id = warehouse?.region_id ? warehouse?.region_id : '';
  const items = [await fetchCountries()];
  if (country_id) items.push(await fetchCities({ country_id }));
  if (city_id) items.push(await fetchRegions({ city_id }));

  return (
    <NewWarehouseView
      warehouse={warehouse}
      countries={items[0]?.data?.data}
      cities={items[1]?.data}
      regions={items[2]}
    />
  );
}

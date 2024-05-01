import { fetchSingleWarehouse, fetchWarehouseProduct } from 'src/actions/warehouse-actions';

import WareHouseProductView from 'src/sections/warehouses-and-delivery-locations/warehouses/warehouseProducts/view';

export const metadata = {
  title: 'WareHouse Details',
};

type props = {
  params: {
    warehouseId: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
};
export default async function Page({ searchParams, params }: Readonly<props>) {
  const { warehouseId } = params;
  const page = typeof searchParams?.page === 'string' ? Number(searchParams?.page) : 1;
  const limit = typeof searchParams?.limit === 'string' ? Number(searchParams?.limit) : 5;
  const search = typeof searchParams?.search === 'string' ? searchParams?.search : '';
  const res = await fetchWarehouseProduct({ page, limit, search, id: warehouseId });
  const warehouse = (await fetchSingleWarehouse(warehouseId)).data[0];
  return <WareHouseProductView products={res?.data} count={res?.count} warehouse={warehouse} />;
}

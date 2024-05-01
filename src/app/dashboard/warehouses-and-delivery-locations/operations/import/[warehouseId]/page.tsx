import { fetchSingleWarehouse } from 'src/actions/warehouse-actions';

import ImportExport from 'src/sections/warehouses-and-delivery-locations/warehouses/import-and-export/view';
// ----------------------------------------------------------------------

export const metadata = {
  title: 'WareHouse',
};

type props = {
  params: {
    warehouseId: string;
  };
};
export default async function Page({ params }: Readonly<props>) {
  const { warehouseId } = params;
  const warehouse = (await fetchSingleWarehouse(warehouseId)).data[0];
  return <ImportExport warehouseId={warehouseId} type="IMPORT" warehouse={warehouse} />;
}

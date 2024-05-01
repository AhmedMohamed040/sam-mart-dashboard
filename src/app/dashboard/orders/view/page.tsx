import { IDriver } from 'src/@types/driver';
import { FetchDrivers } from 'src/actions/drivers-actions';
import { fetchWarehouses } from 'src/actions/warehouse-actions';
import { FetchOrders, FetchOrdersTotal } from 'src/actions/orders-actions';

import { OrdersView } from 'src/sections/orders/view';

import { ITems } from '../../../../components/AutoComplete/CutomAutocompleteView';

export const metadata = {
  title: 'Orders',
};
type props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

function convertToItems(oldItems: IDriver[]) {
  const newItems: ITems[] = oldItems.map((item) => ({
    id: item.user.id,
    name_ar: item.user.username,
    name_en: item.user.username,
    name: item.user.username,
  }));
  return newItems;
}

export default async function Page({ searchParams }: Readonly<props>) {
  const index = typeof searchParams?.index === 'string' ? searchParams.index : undefined;
  const page = typeof searchParams?.page === 'string' ? Number(searchParams?.page) : 1;
  const limit = typeof searchParams?.limit === 'string' ? Number(searchParams?.limit) : 5;
  const order_search =
    typeof searchParams?.search === 'string' && searchParams?.search?.length
      ? searchParams?.search
      : undefined;
  const delivery_type =
    typeof searchParams?.delivaryType === 'string' && searchParams?.delivaryType?.length
      ? searchParams?.delivaryType
      : undefined;
  const status =
    index ||
    (typeof searchParams?.orderStatus === 'string' && searchParams?.orderStatus?.length
      ? searchParams?.orderStatus
      : undefined);
  const driver_id =
    typeof searchParams?.Driver === 'string' && searchParams?.Driver?.length
      ? searchParams?.Driver
      : undefined;
  const warehouse_id =
    typeof searchParams?.warehouse === 'string' && searchParams?.warehouse?.length
      ? searchParams?.warehouse
      : undefined;
  const is_paid =
    typeof searchParams?.paymentStatus === 'string' && searchParams?.paymentStatus?.length
      ? searchParams?.paymentStatus === 'True'
      : undefined;
  const payment_method =
    typeof searchParams?.payingMethod === 'string' ? searchParams?.payingMethod : undefined;
  const order_date =
    typeof searchParams?.Date === 'string' && searchParams?.Date?.length
      ? searchParams?.Date
      : undefined;
  const orders = await FetchOrders({
    is_paid,
    warehouse_id,
    payment_method,
    driver_id,
    page,
    limit,
    order_search,
    delivery_type,
    status,
    order_date,
  });
  const details = await FetchOrdersTotal();
  const warehouses = await fetchWarehouses({ page: 1, limit: 35, search: '' });
  const drivers = convertToItems(await FetchDrivers());
  return (
    <OrdersView
      title={status ? `${status} Orders` : 'Total Orders'}
      orders={orders?.data}
      count={orders?.meta?.itemCount}
      cardsData={details}
      warehouses={warehouses.data}
      drivers={drivers}
      DisableCards={index !== undefined}
    />
  );
}

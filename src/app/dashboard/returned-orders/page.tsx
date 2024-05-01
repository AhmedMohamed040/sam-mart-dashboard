import { FetchReturnOrders } from 'src/actions/return-orders';

import { ReturnOrdersView } from 'src/sections/return-orders/returned-order-view';

export const metadata = {
  title: 'Orders',
};
type props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function Page({ searchParams }: Readonly<props>) {
  const page = typeof searchParams?.page === 'string' ? Number(searchParams?.page) : 1;
  const limit = typeof searchParams?.limit === 'string' ? Number(searchParams?.limit) : 5;
  const order_search =
    typeof searchParams?.search === 'string' && searchParams?.search?.length
      ? searchParams?.search
      : undefined;
  const order_date =
    typeof searchParams?.Date === 'string' && searchParams?.Date?.length
      ? searchParams?.Date
      : undefined;
  const orderStatus =
    typeof searchParams?.orderStatus === 'string' && searchParams?.orderStatus?.length
      ? searchParams?.orderStatus
      : '';
  const includes = [
    'order.user',
    'returnOrderProducts',
    'returnOrderProducts.shipmentProduct',
    'driver.user',
  ];
  const filters = [];
  if (orderStatus) {
    for (let i = 0; i < 3; i += 1) {
      filters.push(`status=${orderStatus}`);
    }
  }
  if (order_date) {
    for (let i = 0; i < 3; i += 1) {
      if (filters[i]) {
        filters[i] += `,created_at=${order_date}`;
      } else {
        const val = `created_at=${order_date}`;
        filters.push(val);
      }
    }
  }
  if (order_search) {
    filters[0] += `,order.number=${order_search}`;
    filters[1] += `,order.user.name=${order_search}`;
    filters[2] += `,order.user.phone=${order_search}`;
  }
  const orders = await FetchReturnOrders({
    page,
    limit,
    includes,
    filters,
    sortBy: ['created_at=DESC'],
  });
  return (
    <ReturnOrdersView title="Return Requests" orders={orders?.data} count={orders?.meta?.total} />
  );
}

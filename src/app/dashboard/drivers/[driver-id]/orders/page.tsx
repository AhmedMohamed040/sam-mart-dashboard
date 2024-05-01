import { getDriverOrders, getSingleDriver } from 'src/actions/drivers-dashboard-actions';

import DriverOrdersView from 'src/sections/drivers/driver-orders';

type Prop = {
  params: {
    [key: string]: string;
  };
  searchParams: {
    [key: string]: string;
  };
};
// { [key: string]: { [key: string]: string } }
export const metadata = {
  title: 'Driver-Orders',
};
const Page = async ({ params, searchParams }: Prop) => {
  const DRIVER_ID = params['driver-id'];
  const PAGE =
    searchParams?.page && typeof searchParams?.page === 'string' ? searchParams.page : '1';
  const LIMIT =
    searchParams?.limit && typeof searchParams?.limit === 'string' ? searchParams.limit : '5';
  const STATUS =
    searchParams?.status && typeof searchParams?.status === 'string' ? searchParams.status : '';
  const ORDER_DATE =
    searchParams?.order_date && typeof searchParams?.order_date === 'string'
      ? searchParams.order_date
      : '';
  const ORDER_SEARCH =
    searchParams?.order_search && typeof searchParams?.order_search === 'string'
      ? searchParams.order_search
      : '';
  const { ORDERS, META } = await getDriverOrders({
    driver_id: DRIVER_ID,
    page: PAGE,
    limit: LIMIT,
    status: STATUS,
    order_date: ORDER_DATE,
    order_search: ORDER_SEARCH,
  });
  const DRIVER = await getSingleDriver(DRIVER_ID);
  return <DriverOrdersView orders={ORDERS} meta={META} driverName={DRIVER?.username} />;
};

export default Page;

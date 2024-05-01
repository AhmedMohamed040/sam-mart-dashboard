import {
  getSingleReturnOrder,
  getAllDrivers_IDs_Usernames,
} from 'src/actions/return-orders-details';

import ReturnOrderDetailsView from 'src/sections/return-orders/return-order-details-view';
// ----------------------------------------------------------------------

export const metadata = {
  title: 'Order: details',
};

type props = {
  params: {
    orderId: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function Page({ params, searchParams }: props) {
  const returnOrderId =
    typeof searchParams?.returnOrder === 'string' ? searchParams?.returnOrder : '';

  const singleReturnOrder = await getSingleReturnOrder(returnOrderId);
  const DRIVERS = await getAllDrivers_IDs_Usernames();

  return <ReturnOrderDetailsView returnOrder={singleReturnOrder[0]} drivers={DRIVERS} />;
}

import { FetchDriversForSpecificWarehouse } from 'src/actions/drivers-actions';
import { cancelOrder, broadcastOrder, fetchSingleOrder } from 'src/actions/orders-actions';

import OrderDetailsView from 'src/sections/orders/order-details-view';

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
interface Headers {
  orderId: string;
}
export default async function Page({ params, searchParams }: props) {
  const waitingStatus = typeof searchParams?.status === 'string' ? searchParams.status : undefined;

  const headers: Headers = {
    orderId: params.orderId,
  };
  const order = await fetchSingleOrder(headers);
  const FetchedDrivers = await FetchDriversForSpecificWarehouse(order.warehouse.id);

  const cancel = async (id: string) => {
    'use server';

    const res = await cancelOrder({
      shipmentId: id,
    });
    return res;
  };

  const handlebroadcastOrder = async (orderId: string) => {
    'use server';

    await broadcastOrder(orderId);
  };

  return (
    <OrderDetailsView
      order={order}
      cancel={cancel}
      drivers={FetchedDrivers}
      broadcastOrder={handlebroadcastOrder}
      waitingStatus={waitingStatus}
    />
  );
}

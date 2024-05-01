'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

import { paths } from 'src/routes/paths';

import axiosInstance, { endpoints, getErrorMessage } from 'src/utils/axios';

interface IProps {
  page: number;
  limit: number;
  order_search?: string;
  order_date?: string;
  is_paid?: boolean | null;
  payment_method?: string;
  warehouse_id?: string;
  driver_id?: string;
  delivery_type?: string;
  status?: string;
  client_id?: string;
}
export const FetchOrders = async ({
  page,
  limit,
  delivery_type,
  driver_id,
  is_paid = null,
  order_date,
  order_search,
  payment_method,
  status,
  warehouse_id,
  client_id,
}: IProps) => {
  const lang = cookies().get('Language')?.value;
  const accessToken = cookies().get('accessToken')?.value;
  try {
    const res = await axiosInstance.get(`${endpoints.orders.fetch}`, {
      params: {
        page,
        limit,
        delivery_type,
        driver_id,
        is_paid,
        order_date,
        order_search,
        payment_method,
        status,
        warehouse_id,
        client_id,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Accept-Language': lang,
      },
    });
    return res?.data?.data;
  } catch (e) {
    return {
      error: getErrorMessage(e),
    };
  }
};
export const FetchOrdersTotal = async () => {
  const lang = cookies().get('Language')?.value;
  const accessToken = cookies().get('accessToken')?.value;
  try {
    const res = await axiosInstance.get(`${endpoints.orders.details}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Accept-Language': lang,
      },
    });
    return res?.data?.data;
  } catch (e) {
    return {
      error: getErrorMessage(e),
    };
  }
};
export const fetchSingleOrder = async ({ orderId }: { orderId: string }): Promise<any> => {
  const lang = cookies().get('Language')?.value;
  const accessToken = cookies().get('accessToken')?.value;
  try {
    const res = await axiosInstance(`${endpoints.orders.fetchSingleOrder}/${orderId}`, {
      headers: { Authorization: `Bearer ${accessToken}`, 'Accept-Language': lang },
    });

    return res.data.data;
  } catch (error) {
    throw new Error(error);
  }
};
export const cancelOrder = async ({ shipmentId }: { shipmentId: string }): Promise<any> => {
  const lang = cookies().get('Language')?.value;
  const accessToken = cookies().get('accessToken')?.value;
  try {
    const res = await axiosInstance.post(
      `${endpoints.orders.cancelOrder}/${shipmentId}`,
      { reason: 'string' },
      {
        headers: { Authorization: `Bearer ${accessToken}`, 'Accept-Language': lang },
      }
    );
    // revalidatePath(`${endpoints.orders.cancelOrder}/${shipmentId}`);

    return res.data.data;
  } catch (error) {
    throw new Error(error);
  }
};

export const broadcastOrder = async (orderId: string): Promise<any> => {
  const lang = cookies().get('Language')?.value;
  const accessToken = cookies().get('accessToken')?.value;
  try {
    const res = await axiosInstance.post(`${endpoints.orders.broadcastOrder}/${orderId}`, {
      headers: { Authorization: `Bearer ${accessToken}`, 'Accept-Language': lang },
    });

    return res.data.data;
  } catch (error) {
    throw new Error(error);
  }
};

export const setOrderAsProcessing = async (shipmentId: string): Promise<any> => {
  const lang = cookies().get('Language')?.value;
  const accessToken = cookies().get('accessToken')?.value;

  try {
    const res = await axiosInstance.post(
      `${endpoints.shipment.process}/${shipmentId}`,
      {},
      {
        headers: { Authorization: `Bearer ${accessToken}`, 'Accept-Language': lang },
      }
    );
    revalidatePath(paths.dashboard.ordersGroup.total);
    return res?.data;
  } catch (error) {
    return error;
  }
};

export const setOrderAsReady = async (shipmentId: string): Promise<any> => {
  const lang = cookies().get('Language')?.value;
  const accessToken = cookies().get('accessToken')?.value;
  try {
    const res = await axiosInstance.post(
      `${endpoints.shipment.ready}/${shipmentId}`,
      {},
      {
        headers: { Authorization: `Bearer ${accessToken}`, 'Accept-Language': lang },
      }
    );
    revalidatePath(paths.dashboard.ordersGroup.total);
    return res?.data;
  } catch (error) {
    return error;
  }
};

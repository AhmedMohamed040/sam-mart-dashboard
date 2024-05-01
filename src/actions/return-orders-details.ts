'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

import { paths } from 'src/routes/paths';

import { SingleDriver } from 'src/@types/dashboard-drivers';
// import { revalidatePath } from 'next/cache';

import axiosInstance, { endpoints, getErrorMessage } from 'src/utils/axios';

export async function getSingleReturnOrder(return_order_id: string) {
  const accessToken = cookies().get('accessToken')?.value;
  const lang = cookies().get('Language')?.value;

  const includes = [
    'order.user',
    'returnOrderProducts.returnProductReason',
    'returnOrderProducts.shipmentProduct.product.product_images',
    'driver.user',
  ];
  const filters = [`id=${return_order_id}`];
  try {
    const res = await axiosInstance.get(`${endpoints.orders.returnOrders}`, {
      params: { filters, includes },
      headers: { Authorization: `Bearer ${accessToken}`, 'Accept-Language': lang },
    });

    return res.data.data;
  } catch (err) {
    throw new Error(err);
  }
}

export async function getAllDrivers_IDs_Usernames() {
  const accessToken = cookies().get('accessToken')?.value;
  const lang = cookies().get('Language')?.value;

  try {
    const res = await axiosInstance.get(endpoints.driversDashboard.getAll, {
      params: {
        page: 1,
        limit: 10 ** 6,
        status: 'VERIFIED',
      },
      headers: { Authorization: `Bearer ${accessToken}`, 'Accept-Language': lang },
    });

    return res.data.data.data
      .filter((driver: SingleDriver) => driver.warehouse !== null)
      .map((driver: SingleDriver) => {
        const { id, username } = driver;
        return { id, username };
      });
  } catch (err) {
    throw new Error(err);
  }
}

interface ReqBody {
  return_order_products: {
    return_order_product_id: string;
    status: string;
  }[];
  status: string;
  admin_note?: string;
  driver_id: string;
}
export async function acceptOrderAndAssignDriver(reqBody: ReqBody, returnOrderId: string) {
  const accessToken = cookies().get('accessToken')?.value;
  const lang = cookies().get('Language')?.value;
  try {
    const res = await axiosInstance.patch(
      `${endpoints.orders.acceptReturnOrder}/${returnOrderId}`,
      reqBody,
      {
        headers: { Authorization: `Bearer ${accessToken}`, 'Accept-Language': lang },
      }
    );

    revalidatePath(paths.dashboard.returnRequests);
    return res.data;
  } catch (err) {
    return {
      error: getErrorMessage(err),
    };
  }
}

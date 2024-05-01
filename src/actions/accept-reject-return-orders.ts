import { revalidatePath } from 'next/cache';

import { paths } from 'src/routes/paths';

import axiosInstance, { endpoints, getErrorMessage } from 'src/utils/axios';

export const acceptRejectReturnOrders = async (
  accessToken: string,
  lang: string,
  returnOrderId: string,
  dataBody: {
    return_order_products: { return_order_product_id: string; status: string }[];
    status: string;
    admin_note: string;
    driver_id?: string;
  }
): Promise<any> => {
  try {
    const res = await axiosInstance.patch(
      `${endpoints.orders.acceptReturnOrder}/${returnOrderId}`,
      dataBody,
      {
        headers: { Authorization: `Bearer ${accessToken}`, 'Accept-Language': lang },
      }
    );
    return res.status;
  } catch (error) {
    revalidatePath(paths.dashboard.returnRequests);
    return {
      error: getErrorMessage(error),
    };
  }
};

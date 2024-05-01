'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

import { paths } from 'src/routes/paths';

import axiosInstance, { endpoints, getErrorMessage } from 'src/utils/axios';

export const assignDriver = async ({
  shipmentId,
  driverId,
}: {
  shipmentId: string;
  driverId: string;
}) => {
  const accessToken = cookies().get('accessToken')?.value;
  const lang = cookies().get('Language')?.value;

  try {
    const res = await axiosInstance.post(
      `${endpoints.drivers.assignDriver}/${shipmentId}/${driverId}`,
      {},
      {
        headers: { Authorization: `Bearer ${accessToken}`, 'Accept-Language': lang },
      }
    );

    revalidatePath(paths.dashboard.ordersGroup.root);
    return res.data;
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};

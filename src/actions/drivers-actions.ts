import { cookies } from 'next/headers';

import axiosInstance, { endpoints, getErrorMessage } from 'src/utils/axios';

export const FetchDrivers = async () => {
  const lang = cookies().get('Language')?.value;
  const accessToken = cookies().get('accessToken')?.value;
  try {
    const res = await axiosInstance.get(`${endpoints.drivers.fetch}`, {
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

export const FetchDriversForSpecificWarehouse = async (warehouseId: string) => {
  const lang = cookies().get('Language')?.value;
  const accessToken = cookies().get('accessToken')?.value;
  try {
    const res = await axiosInstance.get(`${endpoints.drivers.fetch}?warehouse_id=${warehouseId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Accept-Language': lang,
      },
    });
    return res.data.data;
  } catch (e) {
    return {
      error: getErrorMessage(e),
    };
  }
};

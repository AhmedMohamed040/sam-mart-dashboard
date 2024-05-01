import { cookies } from 'next/headers';

import axiosInstance, { endpoints, getErrorMessage } from 'src/utils/axios';

interface IProps {
  page: number;
  limit: number;
  includes: string[];
  filters: string[];
  sortBy: string[];
}
export const FetchReturnOrders = async ({ page, limit, includes, filters, sortBy }: IProps) => {
  const lang = cookies().get('Language')?.value;
  const accessToken = cookies().get('accessToken')?.value;

  try {
    const res = await axiosInstance.get(`${endpoints.orders.returnOrders}`, {
      params: {
        page,
        limit,
        includes,
        filters,
        sortBy,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Accept-Language': lang,
      },
    });
    return res?.data;
  } catch (e) {
    return {
      error: getErrorMessage(e),
    };
  }
};

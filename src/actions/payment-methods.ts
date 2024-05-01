'use server';

import { cookies } from 'next/headers';

import axiosInstance, { endpoints } from 'src/utils/axios';

interface Params {
  page: number;
  limit: number;
  type?: 'WALLET' | 'CASH';
  sortyBy?: string;
}
export const fetchPaymentMethods = async ({ page = 1, limit = 5, type }: Params): Promise<any> => {
  const lang = cookies().get('Language')?.value;
  const accessToken = cookies().get('accessToken')?.value;

  try {
    const res = await axiosInstance(endpoints.paymentMethods.fetch, {
      params: {
        page,
        limit,
        filters: type ? `type=${type}` : null,
        // sortBy: 'created_at=desc',
      },
      headers: { Authorization: `Bearer ${accessToken}`, 'Accept-Language': lang },
    });
    return res;
  } catch (error) {
    throw new Error(error);
  }
};

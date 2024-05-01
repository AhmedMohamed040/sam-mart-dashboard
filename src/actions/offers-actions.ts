'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

import { paths } from 'src/routes/paths';

import axiosInstance, { endpoints, getErrorMessage } from 'src/utils/axios';

interface Prop {
  page: number;
  limit: number;
  search: string;
}
export const fetchOffers = async ({ page, limit, search }: Prop): Promise<any> => {
  const accessToken = cookies().get('accessToken')?.value;
  const lang = cookies().get('Language')?.value;

  try {
    const res = await axiosInstance(
      `${endpoints.offers.fetch}?page=${page}&limit=${limit}&product_name=${search}`,
      {
        params: {
          sort: 'new',
        },
        headers: { Authorization: `Bearer ${accessToken}`, 'Accept-Language': lang },
      }
    );
    return res;
  } catch (error) {
    throw new Error(error);
  }
};

// eslint-disable-next-line consistent-return
export const fetchSingleOffer = async (id: string): Promise<any> => {
  const accessToken = cookies().get('accessToken')?.value;
  const lang = cookies().get('Language')?.value;

  try {
    const res = await axiosInstance(`${endpoints.offers.fetchSingle}/${id}`, {
      headers: { Authorization: `Bearer ${accessToken}`, 'Accept-Language': lang },
    });
    return res;
  } catch (error) {
    throw new Error(error);
  }
};

export interface OfferFormBody {
  start_date: string;
  end_date: string;
  offer_quantity: number;
  min_offer_quantity: number;
  max_offer_quantity: number;
  discount_type: string;
  discount_value: number;
  is_active: boolean;
  description_ar: string;
  description_en: string;
}
export const addOffer = async ({
  productCategoryPriceId,
  dataBody,
}: {
  productCategoryPriceId: string;
  dataBody: OfferFormBody;
  // eslint-disable-next-line consistent-return
}): Promise<any> => {
  const accessToken = cookies().get('accessToken')?.value;
  const lang = cookies().get('Language')?.value;

  try {
    const res = await axiosInstance.post(
      `${endpoints.offers.add}/${productCategoryPriceId}`,
      dataBody,
      {
        headers: { Authorization: `Bearer ${accessToken}`, 'Accept-Language': lang },
      }
    );
    revalidatePath(paths.dashboard.offers);
  } catch (error) {
    revalidatePath(paths.dashboard.offers);
    return {
      error: getErrorMessage(error),
    };
  }
};

export const editOffer = async ({
  OfferID,
  dataBody,
}: {
  OfferID: string;
  dataBody: OfferFormBody;
  // eslint-disable-next-line consistent-return
}): Promise<any> => {
  const accessToken = cookies().get('accessToken')?.value;
  const lang = cookies().get('Language')?.value;
  try {
    const res = await axiosInstance.put(`${endpoints.offers.edit}/${OfferID}`, dataBody, {
      headers: { Authorization: `Bearer ${accessToken}`, 'Accept-Language': lang },
    });
    revalidatePath(paths.dashboard.offers);
  } catch (error) {
    revalidatePath(paths.dashboard.offers);
    return {
      error: getErrorMessage(error),
    };
  }
};

// eslint-disable-next-line consistent-return
export const deleteOffer = async (OfferID: string): Promise<any> => {
  const accessToken = cookies().get('accessToken')?.value;
  const lang = cookies().get('Language')?.value;

  try {
    const res = await axiosInstance.delete(`${endpoints.offers.delete}/${OfferID}`, {
      headers: { Authorization: `Bearer ${accessToken}`, 'Accept-Language': lang },
    });
    revalidatePath(paths.dashboard.offers);
  } catch (error) {
    revalidatePath(paths.dashboard.offers);

    return {
      error: getErrorMessage(error),
    };
  }
};

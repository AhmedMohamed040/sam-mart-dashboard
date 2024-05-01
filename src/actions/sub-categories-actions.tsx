'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

import axiosInstance, { Params, endpoints, getErrorMessage } from 'src/utils/axios';

export const fetchSubCategories = async ({
  page = 1,
  limit = 5,
  filters,
}: Params): Promise<any> => {
  const lang = cookies().get('Language')?.value;
  const accessToken = cookies().get('accessToken')?.value;

  try {
    const res = await axiosInstance(endpoints.subCategories.fetch, {
      params: {
        page,
        limit,
        filters: filters ? [`name_en=${filters}`, `name_ar=${filters}`] : null,
        sortBy: 'created_at=desc',
      },
      headers: { Authorization: `Bearer ${accessToken}`, 'Accept-Language': lang },
    });
    return res;
  } catch (error) {
    throw new Error(error);
  }
};
export const getSubCatsForLinkingModal = async ({
  filters,
}: {
  filters?: string;
}): Promise<any> => {
  const accessToken = cookies().get('accessToken')?.value;
  const lang = cookies().get('Language')?.value;

  try {
    const res = await axiosInstance(endpoints.subCategories.fetch, {
      params: {
        filters: filters ? [`name_en=${filters}`, `name_ar=${filters}`] : null,
        sortBy: 'created_at=desc',
      },
      headers: { Authorization: `Bearer ${accessToken}`, 'Accept-Language': lang },
    });
    return res;
  } catch (error) {
    throw new Error(error);
  }
};
export const fetchSingleSubcategory = async ({
  subcategoryId,
}: {
  subcategoryId: string;
}): Promise<any> => {
  const accessToken = cookies().get('accessToken')?.value;
  const lang = cookies().get('Language')?.value;

  try {
    const res = await axiosInstance(`${endpoints.subCategories.fetch}/${subcategoryId}`, {
      headers: { Authorization: `Bearer ${accessToken}`, 'Accept-Language': lang },
    });

    return res.data.data;
  } catch (error) {
    throw new Error(error);
  }
};

// eslint-disable-next-line consistent-return
export const AddSubcategory = async (formData: FormData): Promise<any> => {
  const lang = cookies().get('Language')?.value;

  try {
    const accessToken = cookies().get('accessToken')?.value;
    const res = await axiosInstance.post(endpoints.subCategories.fetch, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${accessToken}`,
        'Accept-Language': lang,
      },
    });

    revalidatePath('/dashboard/sub-categories');
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};

// eslint-disable-next-line consistent-return
export const EditSubcategory = async (formData: FormData): Promise<any> => {
  try {
    const lang = cookies().get('Language')?.value;

    const accessToken = cookies().get('accessToken')?.value;
    const res = await axiosInstance.put(endpoints.subCategories.fetch, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${accessToken}`,
        'Accept-Language': lang,
      },
    });
    revalidatePath('/dashboard/sub-categories');
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};
// eslint-disable-next-line consistent-return
export const deleteSubcategory = async (id: string) => {
  try {
    const accessToken = cookies().get('accessToken')?.value;
    const lang = cookies().get('Language')?.value;

    const res = await axiosInstance.delete(`${endpoints.subCategories.fetch}/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Accept-Language': lang,
      },
    });
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
  revalidatePath('/dashboard/sub-categories');
};

export interface linkProductToSubcategoryBody {
  categorySubCategory_id?: string;
  product_id: string;
  order_by: number;
  is_active: true;
}

export const linkProductToSubcategory = async (
  data: linkProductToSubcategoryBody,
  id: string
  // eslint-disable-next-line consistent-return
): Promise<any> => {
  const accessToken = cookies().get('accessToken')?.value;
  const lang = cookies().get('Language')?.value;

  try {
    await axiosInstance.post(`${endpoints.subCategories.linkProducts}`, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'Accept-Language': lang,
      },
    });
    revalidatePath(`/dashboard/sub-categories/${id}`);
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};
export const EditLinkedProduct = async (
  data: linkProductToSubcategoryBody,
  id: string
  // eslint-disable-next-line consistent-return
): Promise<any | void> => {
  const accessToken = cookies().get('accessToken')?.value;
  const lang = cookies().get('Language')?.value;

  try {
    await axiosInstance.put(
      `${endpoints.subCategories.editLinkedProducts}/${data?.product_id}`,
      { order_by: data.order_by, is_active: data.is_active },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          'Accept-Language': lang,
        },
      }
    );
    revalidatePath(`/dashboard/sub-categories/${id}`);
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};
// eslint-disable-next-line consistent-return
export const unlinkProduct = async (id: string): Promise<any> => {
  try {
    const accessToken = cookies().get('accessToken')?.value;
    const lang = cookies().get('Language')?.value;

    await axiosInstance.delete(`${endpoints.subCategories.unlinkProducts}/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Accept-Language': lang,
      },
    });
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
  revalidatePath(`/dashboard/sub-categories`);
};

// eslint-disable-next-line consistent-return
export const ToggleProduct = async (formData: FormData) => {
  const id = formData.get('id');
  const lang = cookies().get('Language')?.value;
  const accessToken = cookies().get('accessToken')?.value;
  const is_active = formData.get('is_active');
  try {
    await axiosInstance.put(
      `${endpoints.subCategories.editLinkedProducts}/${id}`,
      { is_active: is_active === 'false' },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Accept-Language': lang,
        },
      }
    );
    revalidatePath(`/dashboard/sub-categories`);
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};

interface productPriceProps {
  product_sub_category_id: string;
  product_measurement_id: string;
  price: number;
  min_order_quantity: number;
  max_order_quantity: number;
}
export const addProductPrice = async ({
  product_sub_category_id,
  product_measurement_id,
  price,
  min_order_quantity,
  max_order_quantity, // eslint-disable-next-line consistent-return
}: productPriceProps) => {
  const accessToken = cookies().get('accessToken')?.value;
  const lang = cookies().get('Language')?.value;

  try {
    await axiosInstance.post(
      `${endpoints.subCategories.addProductprice}/${product_sub_category_id}`,
      { product_measurement_id, price, min_order_quantity, max_order_quantity },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Accept-Language': lang,
        },
      }
    );
    revalidatePath(`/dashboard/sub-categories`);
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};

interface productServiceProps {
  product_sub_category_id: string;
  product_measurement_id: string;
  price: number;
  additional_service_id: string;
}
export const addServices = async ({
  product_sub_category_id,
  product_measurement_id,
  price,
  additional_service_id, // eslint-disable-next-line consistent-return
}: productServiceProps) => {
  const accessToken = cookies().get('accessToken')?.value;
  const lang = cookies().get('Language')?.value;

  try {
    const res = await axiosInstance.post(
      `${endpoints.subCategories.addProductService}/${product_sub_category_id}/${product_measurement_id}`,
      { product_measurement_id, price, additional_service_id },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Accept-Language': lang,
        },
      }
    );
    revalidatePath(`/dashboard/sub-categories`);
    return res?.data?.data;
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};
// eslint-disable-next-line consistent-return
export const deleteService = async (product_additional_service_id: string) => {
  const accessToken = cookies().get('accessToken')?.value;
  const lang = cookies().get('Language')?.value;

  try {
    const res = await axiosInstance.delete(
      `${endpoints.subCategories.removeProductService}/${product_additional_service_id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Accept-Language': lang,
        },
      }
    );
    revalidatePath(`/dashboard/sub-categories`);
    return res?.data?.data;
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};

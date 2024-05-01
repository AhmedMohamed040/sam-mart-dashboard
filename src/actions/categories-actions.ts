'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

import axiosInstance, { Params, endpoints, getErrorMessage } from 'src/utils/axios';

export const fetchCategories = async ({ page = 1, limit = 5, filters }: Params): Promise<any> => {
  const lang = cookies().get('Language')?.value;
  const accessToken = cookies().get('accessToken')?.value;

  try {
    const res = await axiosInstance(endpoints.categories.fetch, {
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
export const getCatsForLinkingModal = async ({ filters }: { filters?: string }): Promise<any> => {
  const accessToken = cookies().get('accessToken')?.value;
  const lang = cookies().get('Language')?.value;

  try {
    const res = await axiosInstance(endpoints.categories.fetch, {
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
export const fetchSingleCategory = async ({ categoryId }: { categoryId: string }): Promise<any> => {
  const lang = cookies().get('Language')?.value;
  const accessToken = cookies().get('accessToken')?.value;

  try {
    const res = await axiosInstance(`${endpoints.categories.fetch}/${categoryId}`, {
      headers: { Authorization: `Bearer ${accessToken}`, 'Accept-Language': lang },
    });
    return res.data.data;
  } catch (error) {
    throw new Error(error);
  }
};

export const fetchCategorySubcategories = async ({
  categoryId,
}: {
  categoryId: string;
}): Promise<any> => {
  const lang = cookies().get('Language')?.value;
  const accessToken = cookies().get('accessToken')?.value;

  try {
    const res = await axiosInstance(
      `${endpoints.categories.fetch}/${categoryId}${endpoints.categories.subcategories}?all=true`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Accept-Language': lang,
        },
      }
    );
    return res.data.data;
  } catch (error) {
    throw new Error(error);
  }
};

// eslint-disable-next-line consistent-return
export const editCategory = async (formData: FormData): Promise<any> => {
  const lang = cookies().get('Language')?.value;
  const accessToken = cookies().get('accessToken')?.value;

  try {
    await axiosInstance.put(endpoints.categories.fetch, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${accessToken}`,
        'Accept-Language': lang,
      },
    });
    revalidatePath('/dashboard/categories');
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};

// eslint-disable-next-line consistent-return
export const addCategory = async (formData: FormData): Promise<any> => {
  const lang = cookies().get('Language')?.value;
  const accessToken = cookies().get('accessToken')?.value;

  try {
    await axiosInstance.post(endpoints.categories.fetch, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${accessToken}`,
        'Accept-Language': lang,
      },
    });

    revalidatePath('/dashboard/categories');
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};

export interface linkMainCategoryToSubCategoryBody {
  section_category_id: string;
  subcategory_id: string;
  is_active?: boolean;
  order_by?: number;
}
export interface EditMainCategoryToSubCategoryBody {
  id: string;
  is_active?: boolean;
  order_by?: number;
}

export const linkMainCategoryToSubCategory = async (
  data: linkMainCategoryToSubCategoryBody
  // eslint-disable-next-line consistent-return
): Promise<any | void> => {
  const accessToken = cookies().get('accessToken')?.value;
  const lang = cookies().get('Language')?.value;

  try {
    await axiosInstance.post(endpoints.categories.linkSubCategories, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'Accept-Language': lang,
      },
    });
    revalidatePath('/dashboard/categories');
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};

export const EditLinkedCategoryToSubCategory = async (
  data: EditMainCategoryToSubCategoryBody
  // eslint-disable-next-line consistent-return
): Promise<any | void> => {
  const accessToken = cookies().get('accessToken')?.value;
  const lang = cookies().get('Language')?.value;

  try {
    await axiosInstance.put(endpoints.categories.category_subcategory, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'Accept-Language': lang,
      },
    });
    revalidatePath('/dashboard/sections');
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};

// eslint-disable-next-line consistent-return
export const deleteCategory = async (id: string): Promise<any> => {
  try {
    const accessToken = cookies().get('accessToken')?.value;
    const lang = cookies().get('Language')?.value;

    const res = await axiosInstance.delete(`${endpoints.categories.fetch}/${id}`, {
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
  revalidatePath('/dashboard/categories');
};

// eslint-disable-next-line consistent-return
export const deleteSubCategory = async (id: string): Promise<any> => {
  try {
    const accessToken = cookies().get('accessToken')?.value;
    const lang = cookies().get('Language')?.value;

    const res = await axiosInstance.delete(`${endpoints.subCategories.deleteSubCategory}/${id}`, {
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
  revalidatePath('/dashboard/categories');
};

// eslint-disable-next-line consistent-return
export const ToggleSubCategory = async (formData: FormData) => {
  const id = formData.get('id');
  const is_active = formData.get('is_active');
  const lang = cookies().get('Language')?.value;
  const accessToken = cookies().get('accessToken')?.value;

  const data = {
    id,
    is_active: is_active === 'false',
  };

  try {
    await axiosInstance.put(endpoints.categories.category_subcategory, data, {
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
  revalidatePath(`/dashboard/categories/${id}`);
};

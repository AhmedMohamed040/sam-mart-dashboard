'use server';

/* eslint-disable consistent-return */

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

import axiosInstance, { endpoints, getErrorMessage } from 'src/utils/axios';

interface IParams {
  user_id?: string;
  sectionId?: string;
  headers?: { access_token: string };
}

export const fetchSections = async ({ user_id }: IParams) => {
  const lang = cookies().get('Language')?.value;
  const accessToken = cookies().get('accessToken')?.value;
  try {
    const res = await axiosInstance.get(endpoints.sections.fetch, {
      params: { user_id },
      headers: { Authorization: `Bearer ${accessToken}`, 'Accept-Language': lang },
    });

    return res;
  } catch (error) {
    throw new Error(error);
  }
};

export const fetchSingleSection = async ({ sectionId }: { sectionId: string }): Promise<any> => {
  const lang = cookies().get('Language')?.value;
  const accessToken = cookies().get('accessToken')?.value;
  try {
    const res = await axiosInstance(`${endpoints.sections.fetch}/${sectionId}`, {
      headers: { Authorization: `Bearer ${accessToken}`, 'Accept-Language': lang },
    });

    return res.data.data;
  } catch (error) {
    throw new Error(error);
  }
};

export const fetchSectionCategories = async ({
  sectionId,
}: {
  sectionId: string;
}): Promise<any> => {
  const lang = cookies().get('Language')?.value;
  const accessToken = cookies().get('accessToken')?.value;

  try {
    const res = await axiosInstance(
      `${endpoints.sections.fetch}/${sectionId}${endpoints.sections.categories}?all=true`,
      {
        headers: { Authorization: `Bearer ${accessToken}`, 'Accept-Language': lang },
      }
    );
    return res.data.data;
  } catch (error) {
    throw new Error(error);
  }
};
type ToggleParams = {
  id: string;
  is_active: boolean;
};

type IToggleCategory = {
  id: string;
  is_active: boolean;
  access_token: string;
};

export const ToggleSection = async (formData: FormData) => {
  const newIsActive = formData.get('is_active') === 'false' ? 'true' : 'false';
  const accessToken = cookies().get('accessToken')?.value;
  const lang = cookies().get('Language')?.value;

  formData.set('is_active', newIsActive.toString());
  try {
    const res = await axiosInstance.put(endpoints.sections.edit, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${accessToken}`,
        'Accept-Language': lang,
      },
    });
    revalidatePath('/dashboard/sections');
    return res.data;
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};

export const ToggleCategory = async (formData: FormData) => {
  const id = formData.get('id');
  const is_active = formData.get('is_active');
  const lang = cookies().get('Language')?.value;
  const accessToken = cookies().get('accessToken')?.value;

  const data = {
    id,
    is_active: is_active === 'false',
  };

  try {
    await axiosInstance.put(endpoints.sections.section_category, data, {
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
  revalidatePath(`/dashboard/sections/${id}`);
};

export const EditSection = async (formData: FormData): Promise<any> => {
  const lang = cookies().get('Language')?.value;

  try {
    const accessToken = cookies().get('accessToken')?.value;
    const res = await axiosInstance.put(endpoints.sections.fetch, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${accessToken}`,
        'Accept-Language': lang,
      },
    });
    revalidatePath('/dashboard/sections');
    return res.data;
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};

// eslint-disable-next-line consistent-return
export const AddSection = async (formData: FormData): Promise<any> => {
  const lang = cookies().get('Language')?.value;

  try {
    const accessToken = cookies().get('accessToken')?.value;
    const res = await axiosInstance.post(endpoints.sections.fetch, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${accessToken}`,
        'Accept-Language': lang,
      },
    });
    revalidatePath('/dashboard/sections');
    return res.data;
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};

export const deleteSection = async (id: string) => {
  const lang = cookies().get('Language')?.value;

  try {
    const accessToken = cookies().get('accessToken')?.value;
    const res = await axiosInstance.delete(`${endpoints.sections.edit}/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Accept-Language': lang,
      },
    });
    return res.data;
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
  revalidatePath('/dashboard/sections');
};

export const deleteCategory = async (id: string) => {
  const lang = cookies().get('Language')?.value;
  const accessToken = cookies().get('accessToken')?.value;

  try {
    const res = await axiosInstance.delete(`${endpoints.sections.section_category}/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Accept-Language': lang,
      },
    });
    return res.data;
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
  revalidatePath(`/dashboard/sections/${id}`);
};

// eslint-disable-next-line consistent-return
export const importSections = async (formdata: FormData): Promise<any> => {
  const lang = cookies().get('Language')?.value;
  const accessToken = cookies().get('accessToken')?.value;
  try {
    const res = await axiosInstance.post(endpoints.sections.import, formdata, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'multipart/form-data',
        'Accept-Language': lang,
      },
    });
    revalidatePath('/dashboard/sections');
    return res.data;
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};

export const exportSections = async (): Promise<any> => {
  const lang = cookies().get('Language')?.value;
  const accessToken = cookies().get('accessToken')?.value;
  try {
    const res = await axiosInstance.get(endpoints.sections.export, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        // "Content-Type":"application/vnd.ms-excel",
        // "Content-Type":"application/octet-stream",
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Accept-Language': lang,
        // 'accept-ranges': 'bytes',
        responseType: 'blob',
      },
    });
    return res.data;
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};
export interface linkSectionToMainCategoryBody {
  section_id?: string;
  id?: string;
  category_id?: string;
  is_active: boolean;
  order_by: number;
}

export const linkSectionToMainCategory = async (
  data: linkSectionToMainCategoryBody
  // eslint-disable-next-line consistent-return
): Promise<any | void> => {
  const accessToken = cookies().get('accessToken')?.value;
  const lang = cookies().get('Language')?.value;

  try {
    await axiosInstance.post(endpoints.sections.linkCategories, data, {
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
export const EditLinkedCategoryInSection = async (
  data: linkSectionToMainCategoryBody
  // eslint-disable-next-line consistent-return
): Promise<any | void> => {
  const accessToken = cookies().get('accessToken')?.value;
  const lang = cookies().get('Language')?.value;

  try {
    await axiosInstance.put(endpoints.sections.EditlinkedCategories, data, {
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

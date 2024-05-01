'use server';

import { cookies } from 'next/headers';

import axiosInstance, { endpoints } from 'src/utils/axios';

export type StaticPage = 'ABOUT_US' | 'TERMS_AND_CONDITIONS' | 'PRIVACY_POLICY' | 'RETURN_POLICY';
interface PatchDataBody {
  static_page_type: StaticPage;
  content_ar: string;
  content_en: string;
}
export async function patchStaticPage(dataBody: PatchDataBody) {
  const lang = cookies().get('Language')?.value;
  const accessToken = cookies().get('accessToken')?.value;

  try {
    const res = await axiosInstance.patch(endpoints.staticPage.edit, dataBody, {
      headers: { Authorization: `Bearer ${accessToken}`, 'Accept-Language': lang },
    });
    return res?.data;
  } catch (error) {
    throw new Error(error);
  }
}

export async function fetchStaticPage(type: StaticPage) {
  const accessToken = cookies().get('accessToken')?.value;

  try {
    const res_ar = await axiosInstance.get(`${endpoints.staticPage.fetch}/${type}`, {
      headers: { Authorization: `Bearer ${accessToken}`, 'Accept-Language': 'ar' },
    });
    const res_en = await axiosInstance.get(`${endpoints.staticPage.fetch}/${type}`, {
      headers: { Authorization: `Bearer ${accessToken}`, 'Accept-Language': 'en' },
    });
    const res = {
      content_ar: res_ar?.data?.data?.content,
      content_en: res_en?.data?.data?.content,
    };

    return res;
  } catch (error) {
    throw new Error(error);
  }
}

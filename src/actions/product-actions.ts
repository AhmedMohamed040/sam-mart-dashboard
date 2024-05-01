'use server';

/* eslint-disable consistent-return */

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

import { paths } from 'src/routes/paths';

import axiosInstance, { endpoints, getErrorMessage } from 'src/utils/axios';

interface IParams {
  page: number;
  limit: number;
  filters?: string;
  barcode?: string;
  section_id?: string;
  category_sub_category_id?: string;
  section_category_id?: string;
}
export const fetchProducts = async ({
  page = 1,
  limit = 5,
  filters = '',
  barcode = '',
  section_id,
  category_sub_category_id,
  section_category_id,
}: IParams): Promise<any> => {
  const accessToken = cookies().get('accessToken')?.value;
  const lang = cookies().get('Language')?.value;
  try {
    const res = await axiosInstance.get(endpoints.product.fetch, {
      params: {
        page,
        limit,
        product_name: filters,
        product_barcode: barcode,
        section_id,
        category_sub_category_id,
        section_category_id,
        sort: 'new',
      },
      headers: { Authorization: `Bearer ${accessToken}`, 'Accept-Language': lang },
    });
    return res?.data;
  } catch (error) {
    throw new Error(error);
  }
};
export const getProductsForLinkingModal = async ({
  filters = '',
}: {
  filters?: string;
}): Promise<any> => {
  const accessToken = cookies().get('accessToken')?.value;
  const lang = cookies().get('Language')?.value;
  try {
    const res = await axiosInstance.get(endpoints.product.fetch, {
      params: {
        product_name: filters,
        page: 1,
        limit: 10 ** 6,
        sort: 'new',
      },
      headers: { Authorization: `Bearer ${accessToken}`, 'Accept-Language': lang },
    });
    return res?.data;
  } catch (error) {
    throw new Error(error);
  }
};
export const fetchSingleProduct = async ({
  productID,
  subcategoryId,
}: {
  productID: string;
  subcategoryId?: string;
}): Promise<any> => {
  const lang = cookies().get('Language')?.value;

  const accessToken = cookies().get('accessToken')?.value;
  try {
    const res = await axiosInstance.get(
      `${endpoints.product.fetchSingle}?product_id=${productID}`,
      {
        params: { category_sub_category_id: subcategoryId },
        headers: { Authorization: `Bearer ${accessToken}`, 'Accept-Language': lang },
      }
    );
    return res.data.data;
  } catch (error) {
    throw new Error(error);
  }
};
export const getSingleProductWithBarCode = async ({
  product_id_or_barcode,
}: {
  product_id_or_barcode: string;
}): Promise<any> => {
  const lang = cookies().get('Language')?.value;

  const accessToken = cookies().get('accessToken')?.value;
  try {
    const res = await axiosInstance.get(
      `${endpoints.product.fetchSingle}?product_id=${product_id_or_barcode}`,
      {
        headers: { Authorization: `Bearer ${accessToken}`, 'Accept-Language': lang },
      }
    );
    return res.data.data;
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};
export const editProductDetails = async ({
  productId,
  dataBody,
}: {
  productId: string;
  dataBody: any;
}): Promise<any> => {
  const accessToken = cookies().get('accessToken')?.value;
  const lang = cookies().get('Language')?.value;

  try {
    const res = await axiosInstance.put(`${endpoints.product.editDetails}/${productId}`, dataBody, {
      params: { product_id: productId },
      headers: { Authorization: `Bearer ${accessToken}`, 'Accept-Language': lang },
    });
    revalidatePath(paths.dashboard.productsGroup.root);
    return res?.data?.message;
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};
interface IEditMeasure {
  productId: string;
  productMeasurementUnitId: string;
  dataBody: any;
}
export const editProductMeasures = async ({
  productId,
  productMeasurementUnitId,
  dataBody, // eslint-disable-next-line consistent-return
}: IEditMeasure): Promise<any> => {
  const accessToken = cookies().get('accessToken')?.value;
  const lang = cookies().get('Language')?.value;

  dataBody.conversion_factor = Number(dataBody.conversion_factor);
  try {
    const res = await axiosInstance.put(
      `${endpoints.product.editMeasurement}/${productId}/${productMeasurementUnitId}`,
      dataBody,
      {
        headers: { Authorization: `Bearer ${accessToken}`, 'Accept-Language': lang },
      }
    );
    revalidatePath(`dashboard/products/edit/${productId}`);
    return res.data;
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};

export const deleteProduct = async ({ productID }: { productID: string }): Promise<any> => {
  const accessToken = cookies().get('accessToken')?.value;
  const lang = cookies().get('Language')?.value;

  try {
    const res = await axiosInstance.delete(`${endpoints.product.delete}/${productID}`, {
      headers: { Authorization: `Bearer ${accessToken}`, 'Accept-Language': lang },
    });
    revalidatePath(paths.dashboard.productsGroup.root);
    return res.data;
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};
// eslint-disable-next-line consistent-return
export const addProduct = async (formData: any): Promise<any> => {
  const accessToken = cookies().get('accessToken')?.value;
  const lang = cookies().get('Language')?.value;

  try {
    const res = await axiosInstance.post(endpoints.product.add, formData.formData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Accept-Language': lang,
      },
    });

    return res.data.statusCode;
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};
export const addProductUnit = async (unit: any, productId: any): Promise<any> => {
  const accessToken = cookies().get('accessToken')?.value;
  const lang = cookies().get('Language')?.value;

  try {
    const res = await axiosInstance.post(`${endpoints.product.addMeasurement}/${productId}`, unit, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Accept-Language': lang,
      },
    });
    revalidatePath(paths.dashboard.productsGroup.root);
    return res.data;
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};
export const deleteProductUnit = async (
  productMeasurementUnitId: any,
  productId: any
): Promise<any> => {
  const accessToken = cookies().get('accessToken')?.value;
  const lang = cookies().get('Language')?.value;

  try {
    const res = await axiosInstance.delete(
      `${endpoints.product.deleteMeasurement}/${productId}/${productMeasurementUnitId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Accept-Language': lang,
        },
      }
    );
    revalidatePath(paths.dashboard.productsGroup.root);
    return res.data.message;
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};
export const addProductImage = async (image: any, productId: any): Promise<any> => {
  const accessToken = cookies().get('accessToken')?.value;
  const lang = cookies().get('Language')?.value;

  try {
    const res = await axiosInstance.post(`${endpoints.product.addImage}/${productId}`, image, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${accessToken}`,
        'Accept-Language': lang,
      },
    });
    revalidatePath(paths.dashboard.productsGroup.root);
    return res.data;
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};
export const deleteProductImage = async (productImageId: any, productId: any): Promise<any> => {
  const accessToken = cookies().get('accessToken')?.value;
  const lang = cookies().get('Language')?.value;

  try {
    const res = await axiosInstance.delete(
      `${endpoints.product.deleteImage}/${productId}/${productImageId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Accept-Language': lang,
        },
      }
    );
    revalidatePath(paths.dashboard.productsGroup.root);
    return res.data;
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};
export const updateProductLogo = async (
  imageId: string,
  productId: string | undefined
): Promise<any> => {
  const accessToken = cookies().get('accessToken')?.value;
  const lang = cookies().get('Language')?.value;

  try {
    const res = await axiosInstance.put(
      `${endpoints.product.editLogoImage}/${productId}/${imageId}`,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${accessToken}`,
          'Accept-Language': lang,
        },
      }
    );
    revalidatePath(paths.dashboard.productsGroup.root);
    return res.data;
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};

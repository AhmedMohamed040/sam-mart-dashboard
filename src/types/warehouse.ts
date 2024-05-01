import { MeasurementUnit } from 'src/@types/products';

export interface IWarehouseProduct {
  id: string;
  barcode: string;
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  logo: string;
  quantity: number;
  product_measurement: MeasurementUnit;
}

export type ISection = {
  id: string;
  name: string;
  name_ar?: string;
  name_en: string;
  logo: string;
  order_by: number;
  min_order_price: string;
  allowed_roles: string[] | string;
  is_active: boolean;
  delivery_price: string;
  delivery_type: string;
};

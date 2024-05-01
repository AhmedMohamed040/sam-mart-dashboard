export interface Offers {
  offer_id?: string;
  offer_price?: string;
  min_order_quantity?: number;
  mix_order_quantity?: number;
  offer_is_active?: boolean;
  offer_discount_value?: string;
  offer_discount_type?: string;
  offer_start_date?: string;
  offer_end_date?: string;
  offer_quantity?: number;
  product_category_price_id?: string;
  product_id?: string;
  name?: string;
  name_ar?: string;
  name_en?: string;
  product_logo?: string;
  product_measurement_id?: string;
  measurement_unit_id?: string;
  measurement_unit_ar?: string;
  measurement_unit_en?: string;
  product_offer_description_ar?: string;
  product_offer_description_en?: string;
  product_barcode: string;
}

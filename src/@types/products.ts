export interface IProduct {
  product_id: string;
  name_ar: string;
  name_en: string;
  product_logo: string;
  product_is_active: boolean;
  product_is_recovered: boolean;
  barcode: string;
  quantity_available: number;
  product_sub_category_id: string;
  product_sub_category_order_by: number;
  product_sub_category_is_active: boolean;
  measurement_unit_ar: string;
  measurement_unit_en: string;
}

export interface ISingleProduct {
  product: Product;
  product_sub_category: ProductSubCategory;
  product_measurements: ProductMeasurement[];
}

export interface Product {
  product_sub_category_id: string;
  product_id: string;
  name_ar: string;
  name_en: string;
  product_description_ar: string;
  product_description_en: string;
  product_is_active: boolean;
  product_is_recovered: boolean;
  product_barcode: string;
  quantity_available: number;
  product_logo: string;
  product_images: ProductImage[];
}

export interface ProductImage {
  url: string;
  id: string;
  is_logo: boolean;
}

export interface ProductSubCategory {
  product_sub_category_id: string;
  product_sub_category_order_by: number;
  product_sub_category_is_active: boolean;
}

export interface ProductMeasurement {
  product_measurement_id: string;
  measurement_unit_id: string;
  measurement_unit_ar: string;
  measurement_unit_en: string;
  is_main_unit: boolean;
  conversion_factor: string;
  product_category_price?: ProductCategoryPrice;
  product_additional_services?: ProductAdditionalService[];
}

export interface ProductCategoryPrice {
  product_category_price_id: string;
  product_price: string;
  max_order_quantity: number;
  min_order_quantity: number;
}

export interface ProductAdditionalService {
  product_additional_service_id: string;
  price: string;
  additional_service: AdditionalService;
}

export interface AdditionalService {
  additional_service_id: string;
  name_ar: string;
  name_en: string;
}

export interface CategorySubCategory {
  id: string;
  section_category_id: string;
  subcategory_id: string;
  order_by: number;
  is_active: boolean;
  section_category: SectionCategory;
}

export interface SectionCategory {
  id: string;
  section_id: string;
  category_id: string;
  order_by: number;
  is_active: boolean;
  section: Section;
}

export interface Section {
  id: string;
  name_ar: string;
  name_en: string;
  logo: string;
  order_by: number;
  min_order_price: string;
  allowed_roles: string[];
  delivery_price: string;
  delivery_type: string;
}

export interface MeasurementUnit {
  id: string;
  name_ar: string;
  name_en: string;
}

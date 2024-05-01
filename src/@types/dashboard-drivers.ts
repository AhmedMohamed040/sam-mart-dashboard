export interface City {
  id: string;
  name_ar: string;
  name_en: string;
}
export interface Region {
  id: string;
  name_ar: string;
  name_en: string;
}
export interface Country {
  id: string;
  name_ar: string;
  name_en: string;
}
export interface Address {
  latitude: number;
  longitude: number;
  country: Country;
  city: City;
  region: Region;
}
export interface Vehicle {
  vehicle_type: string;
  vehicle_color: string;
  vehicle_model: string;
  vehicle_number?: string;
  license_number: string;
  license_image: string;
}
export interface IDCard {
  id_card_number: string;
  id_card_image: string;
}
export interface Warehouse {
  id: string | null;
  name_ar: string;
  name_en: string;
}
export type SingleDriver = {
  id: string;
  user_id: string;
  username: string;
  phone: string;
  email: string | null;
  avatar: string | null;
  birth_date: Date | null;
  created_at: Date | null;
  driver_status: string;
  vehicle: Vehicle;
  address: Address;
  idCard: IDCard;
  warehouse: Warehouse | null;
  wallet_balance: number;
};
export interface META {
  page: number;
  take: number;
  itemCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
export interface Driver {
  avatar: string | null;
  birth_date: Date | null | string;
  city: City;
  country: Country;
  created_at: string | Date | null;
  driver_status: string;
  email: string | null;
  id: string;
  idCard: IDCard;
  phone: string;
  region: Region;
  username: string;
  wallet_balance: number;
}
export interface VEHICLE {
  id: string;
  vehicle: Vehicle;
}

export interface DriverViewTableRow {
  id: string;
  username: string;
  phone: string;
  email: string | null;
  birth_date: Date | string | null;
  id_card_number: string | number;
  created_at: string | Date | null;
  driver_status: string;
  country: Country;
  city: City;
  region: Region;
  vehicle_type: string;
  wallet_balance: string | number;
  warehouse: Warehouse;
  maximumOrders: number;
}
export interface Analytics {
  total: number;
  totalPending: number;
  totalVerified: number;
  totalBlocked: number;
}

export interface USER_IN_DRIVER_ORDER_DETAILS {
  id: string;
  username: string;
  email: string | null;
  phone: string;
  avatar: string | null;
  birth_date: string | Date | null;
  gender: string | null;
}
export interface DRIVER_INSIDE_ORDER_DETAILS {
  id: string;
  warehouse_id: string | null;
  latitude: number | string;
  longitue: number | string;
  is_receive_orders: boolean;
  user: USER_IN_DRIVER_ORDER_DETAILS;
}
export interface WAREHOUSE_INSIDE_ORDER_DETAILS {
  id: string;
  name: string;
  name_en: string;
  latitude: number | string;
  longitude: number | string;
  is_active: boolean;
}
export interface PRODUCT_LOGO {
  id: string;
  is_logo: boolean;
  url: string | null;
}
export interface SHIPMENT_PRODUCT_IN_ORDER_DETAILS {
  id: string;
  product_id: string;
  product_logo: PRODUCT_LOGO;
  product_name: string;
  product_name_en: string;
  product_description: string;
  product_description_en: string;
  price: string | number;
  quantity: number;
  conversion_factor: number;
  measurement_unit: { [key: string]: string };
  section_id: string;
  shipment_id: string;
  main_measurement_id: string;
}
export interface CLIENT_IN_ORDER_IN_ORDER_DETAILS {
  id: string;
  name: string;
  phone: string;
  avatar: string | null;
}
export interface ORDER_IN_ORDER_DETAILS {
  id: string;
  client: CLIENT_IN_ORDER_IN_ORDER_DETAILS;
  total_price: string | number;
  payment_method: string;
  is_paid: boolean;
  delivery_type: string;
  estimated_delivery_time: string | Date | null;
  slot_id: string | null;
  delivery_day: Date | string | null;
  number: number | string;
  delivery_fee: string | number;
  created_at: string | Date | null;
}
export interface ORDER_DETAILS {
  shipment_id: string;
  // driver: DRIVER_INSIDE_ORDER_DETAILS;
  warehouse: WAREHOUSE_INSIDE_ORDER_DETAILS;
  shipment_products: SHIPMENT_PRODUCT_IN_ORDER_DETAILS[] | [];
  order: ORDER_IN_ORDER_DETAILS;
  status: string;
  order_confirmed_at: string | Date | null;
  order_on_processed_at: string | Date | null;
  order_shipped_at: string | Date | null;
}
export interface HANDLEDED_ORDERS_LIST {
  number: string | number;
  created_at: string | Date | null;
  status: string;
  total_price: string | number;
  name: string;
  phone: string;
  payment_method: string;
  delivery_type: string;
  delivery_day: Date | null | string;
  shipment_id: string;
  orderId: string;
  userId: string;
}

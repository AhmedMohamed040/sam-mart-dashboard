export interface IOrder {
  order_id: string;
  slot_id: any;
  section_id: string;
  order_created_at: string;
  order_number: string;
  order_products: number;
  total_price: string;
  payment_method: string;
  is_paid: boolean;
  delivery_day: string;
  warehouse: Warehouse;
  user: User;
  address: Address;
  shipments: Shipments;
  delivery_type: string;
  delivery_fee: string;
}

export interface Warehouse {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  phone: string;
}

export interface Address {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

export interface Shipments {
  id: string;
  order_id: string;
  driver: Driver;
  status: string;
  order_confirmed_at: any;
  order_on_processed_at: any;
  order_shipped_at: any;
  order_delivered_at: any;
  order_canceled_at: any;
}

export interface ICardData {
  ordersNew: number;
  ordersDriversAccepted: number;
  ordersProcessing: number;
  ordersReadyForPickup: number;
  ordersPicked: number;
  ordersDelivered: number;
  ordersCanceled: number;
  ordersTotal: number;
}
export interface Driver {
  id: string;
  username: string;
  email: string;
  phone: string;
}

export interface IOrderDetails {
  id?: string;
  order_id: string;
  slot_id: any;
  section: {
    id: string;
    name: string;
    name_en: string;
  };
  order_created_at: string;
  order_number: string;
  order_products: number;
  total_price: string;
  payment_method: string;
  is_paid: boolean;
  delivery_day: string;
  delivery_type: string;
  delivery_fee: string;
  warehouse: {
    id: string;
    name: string;
    name_en: string;
    latitude: number;
    longitude: number;
  };
  user: {
    id: string;
    username: string;
    email: string;
    phone: string;
  };
  address: {
    id: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
  };
  shipments: {
    id: string;
    order_id: string;
    driver: any;
    status: string;
    order_confirmed_at: any;
    order_on_processed_at: any;
    order_shipped_at: any;
    order_delivered_at: any;
    order_canceled_at: string;
    shipment_products: Array<{
      id: string;
      shipment_id: string;
      product_id: string;
      quantity: number;
      price: string;
      product_name: string;
      product_name_en: string;
      total_price: number;
      sub_category_name: string;
      sub_category_name_en: string;
      category_name: string;
      category_name_en: string;
      barcode: string;
    }>;
  };
}

export interface IShipments {
  id: string;
  shipment_id: string;
  product_id: string;
  quantity: number;
  price: string;
  product_name: string;
  product_name_en: string;
  product_logo?: string;
  total_price: number;
  sub_category_name: string;
  sub_category_name_en: string;
  category_name: string;
  category_name_en: string;
  barcode: string;
}

export interface VERTICAL_BAR_ORDERS {
  ordersTotal: number;
  ordersNew: number;
  ordersDriversAccepted: number;
  ordersReadyForPickup: number;
  ordersProcessing: number;
  ordersPicked: number;
  ordersDelivered: number;
  ordersCanceled: number;
}

export interface INITIAL_TYPES {
  Orders: VERTICAL_BAR_ORDERS;
}

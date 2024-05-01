import { META, SingleDriver, ORDER_DETAILS } from 'src/@types/dashboard-drivers';

export const getDriversViewRequiredContentForTheTable = (
  allDrivers: SingleDriver[] | [],
  meta: META
) => {
  const driversTableView = allDrivers.map((driver) => {
    const {
      id,
      username,
      user_id,
      phone,
      email,
      birth_date,
      idCard: { id_card_number },
      created_at,
      driver_status,
      address,
      vehicle: { vehicle_type },
      wallet_balance,
      warehouse,
    } = driver;
    const { country, city, region } = address;
    return {
      id,
      username,
      user_id,
      phone,
      email,
      birth_date,
      id_card_number,
      created_at,
      driver_status,
      country,
      city,
      region,
      vehicle_type,
      wallet_balance,
      warehouse: warehouse || { id: null, name_en: 'No Warehouse', name_ar: 'لا يوجد مستودع' },
      maximumOrders: 20,
    };
  });

  return {
    TABLE: driversTableView,
    META: meta,
  };
};

export const getDriverDetails = (driverDetailsObject: SingleDriver) => {
  const {
    id,
    username,
    user_id,
    idCard,
    phone,
    email,
    birth_date,
    address: { city, country, region },
    created_at,
    driver_status,
    wallet_balance,
    avatar,
  } = driverDetailsObject;
  return {
    id,
    username,
    user_id,
    idCard,
    phone,
    email,
    birth_date,
    city,
    country,
    region,
    created_at,
    driver_status,
    wallet_balance,
    avatar,
  };
};
export const getVehicleDetails = (driverDetailsObject: SingleDriver) => {
  const { id, vehicle } = driverDetailsObject;
  return {
    id,
    vehicle,
  };
};

export const getSingleDriverOrdersRequiredDataForTheTable = (
  singleDriverOrders: ORDER_DETAILS[] | []
) => {
  const requiredData = singleDriverOrders.map((order) => {
    const {
      shipment_id,
      order: {
        id: orderId,
        number,
        total_price,
        payment_method,
        delivery_type,
        delivery_day,
        created_at,
        client: { id: userId, name, phone },
      },
      status,
    } = order;
    return {
      shipment_id,
      orderId,
      number,
      created_at,
      delivery_day,
      status,
      total_price,
      phone,
      payment_method,
      delivery_type,
      userId,
      name,
    };
  });

  return requiredData;
};

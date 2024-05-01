import { useMemo } from 'react';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';
import { useVerticalNavDataContext } from 'src/contexts/dashboard-vertical-bar-values';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
// ----------------------------------------------------------------------

const icon = (name: string) => (
  // <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
  // OR
  <Iconify icon={name} width={24} height={24} />
  // https://icon-sets.iconify.design/solar/
  // https://www.streamlinehq.com/icons
);

const ICONS = {
  main: icon('mdi-light:chart-line'),
  sections: icon('lucide:network'),
  categories: icon('bi:grid-fill'),
  subCategories: icon('fluent:list-bar-16-filled'),
  products: icon('dashicons:products'),
  clients: icon('mingcute:group-fill'),
  clientsWallet: icon('ic_clients-wallet'),
  orders: icon('ion:cart-outline'),
  offers: icon('bxs:offer'),
  coupons: icon('mdi:coupon-outline'),
  employees: icon('clarity:employee-group-line'),
  drivers: icon('healthicons:truck-driver-outline'),
  driversWallet: icon('ph:wallet-duotone'),
  warehouses: icon('iconoir:delivery-truck'),
  paymentMethods: icon('tdesign:money'),
  currencies: icon('ic_currencies'),
  return: icon('carbon:deployment-policy'),
  notifications: icon('ic:outline-notifications-active'),
  advertisements: icon('tabler:ad'),
  appPages: icon('gravity-ui:square-bars-vertical'),
  reports: icon('oui:app-reporting'),
  loyaltySystem: icon('material-symbols:loyalty-outline'),
  settings: icon('teenyicons:cog-outline'),
  sliders: icon('ph:sliders'),
  workingArea: icon('mdi:locations'),
  reasons: icon('ph:question'),
  terms: icon('fluent-mdl2:entitlement-policy'),
  about: icon('mdi:about-circle-outline'),
  returnRequests: icon('fontisto:arrow-return-left'),
  privacy: icon('iconoir:privacy-policy'),
  banars: icon('material-symbols:wallpaper'),
  dataManagements: icon('fa:cogs'),
};

export function useNavData() {
  const { Orders } = useVerticalNavDataContext();
  const { t } = useTranslate();
  const data = useMemo(
    () => [
      {
        items: [
          { title: t('main'), path: paths.dashboard.root, icon: ICONS.main },
          { title: t('sections'), path: paths.dashboard.sections, icon: ICONS.sections },
          { title: t('categories'), path: paths.dashboard.categories, icon: ICONS.categories },
          {
            title: t('sub_categories'),
            path: paths.dashboard.subCategories,
            icon: ICONS.subCategories,
          },
          {
            title: t('products'),
            path: paths.dashboard.productsGroup.total,
            icon: ICONS.products,
            info: <Label>356</Label>,
          },
          {
            title: t('warehouses_and_delivery_locations'),
            path: paths.dashboard.warehousesAndDeliveryLocations,
            icon: ICONS.warehouses,
          },
          { title: t('working_areas'), path: paths.dashboard.workingArea, icon: ICONS.workingArea },
          {
            title: t('orders'),
            path: paths.dashboard.ordersGroup.root,
            icon: ICONS.orders,
            children: [
              {
                title: t('new_orders'),
                path: paths.dashboard.ordersGroup.newOrders,
                info: <Label>{Orders.ordersNew}</Label>,
              },
              {
                title: t('drivers_accepted_orders'),
                path: paths.dashboard.ordersGroup.driverAcceptedOrders,
                info: <Label>{Orders.ordersDriversAccepted}</Label>,
              },
              {
                title: t('processing_orders'),
                path: paths.dashboard.ordersGroup.processingOrders,
                info: <Label>{Orders.ordersProcessing}</Label>,
              },
              {
                title: t('ready_for_pick_up_orders'),
                path: paths.dashboard.ordersGroup.readyForPickUpOrders,
                info: <Label>{Orders.ordersReadyForPickup}</Label>,
              },
              {
                title: t('picked_up_orders'),
                path: paths.dashboard.ordersGroup.pickedUpOrders,
                info: <Label>{Orders.ordersPicked}</Label>,
              },
              {
                title: t('delivered_orders'),
                path: paths.dashboard.ordersGroup.deliveredOrders,
                info: <Label>{Orders.ordersDelivered}</Label>,
              },
              {
                title: t('cancelled_orders'),
                path: paths.dashboard.ordersGroup.cancelledOrders,
                info: <Label>{Orders.ordersCanceled}</Label>,
              },
              {
                title: t('Total Orders'),
                path: paths.dashboard.ordersGroup.total,
                info: <Label>{Orders.ordersTotal}</Label>,
              },
            ],
          },
          {
            title: t('return_requests'),
            path: paths.dashboard.returnRequests,
            icon: ICONS.returnRequests,
            info: <Label>40</Label>,
          },
          { title: t('employees'), path: paths.dashboard.employees, icon: ICONS.employees },
          {
            title: t('drivers'),
            path: paths.dashboard.drivers,
            icon: ICONS.drivers,
          },
          { title: t('clients'), path: paths.dashboard.clients, icon: ICONS.clients },
          {
            title: t('dataManagements'),
            path: paths.dashboard.dataManagementsGroup.root,
            icon: ICONS.dataManagements,
            children: [
              {
                title: t('units'),
                path: paths.dashboard.dataManagementsGroup.units,
              },
              {
                title: t('additional_services'),
                path: paths.dashboard.dataManagementsGroup.additionalServices,
              },
              { title: t('countries'), path: paths.dashboard.dataManagementsGroup.countries },
              { title: t('currencies'), path: paths.dashboard.dataManagementsGroup.currencies },
            ],
          },
          { title: t('banars'), path: paths.dashboard.banars, icon: ICONS.banars },
          { title: t('offers'), path: paths.dashboard.offers, icon: ICONS.offers },
          {
            title: t('Reasons'),
            path: paths.dashboard.reasons,
            icon: ICONS.reasons,
          },
          {
            title: t('Payment Methods'),
            path: paths.dashboard.paymentMethods,
            icon: ICONS.paymentMethods,
          },
          {
            title: t('notifications'),
            path: paths.dashboard.notifications,
            icon: ICONS.notifications,
          },
          { title: t('TERMS_AND_CONDITIONS'), path: paths.dashboard.terms, icon: ICONS.terms },
          { title: t('PRIVACY_POLICY'), path: paths.dashboard.privacy, icon: ICONS.privacy },
          { title: t('RETURN_POLICY'), path: paths.dashboard.return, icon: ICONS.return },
          { title: t('ABOUT_US'), path: paths.dashboard.about, icon: ICONS.about },
        ],
      },
    ],
    [t, Orders]
  );

  return data;
}

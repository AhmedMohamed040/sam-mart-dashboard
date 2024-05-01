import { fetchCountries } from 'src/actions/countries';
import {
  getCities,
  getRegions,
  getAllDrivers,
  getDriversAnalytics,
  getRequiredWarehouseDataForDrivers,
} from 'src/actions/drivers-dashboard-actions';

import DriversView from 'src/sections/drivers';

export const metadata = {
  title: 'Drivers',
};

type props = {
  searchParams: { [key: string]: string | undefined };
};
const Page = async ({ searchParams }: props) => {
  const STATUS =
    searchParams?.status && typeof searchParams?.status === 'string' ? searchParams.status : '';
  const DRIVER_SEARCH =
    searchParams?.driver_search && typeof searchParams?.driver_search === 'string'
      ? searchParams.driver_search
      : '';
  const COUNTRY_ID =
    searchParams?.country_id && typeof searchParams?.country_id === 'string'
      ? searchParams.country_id
      : '';
  const CITY_ID =
    searchParams?.city_id && typeof searchParams?.city_id === 'string' ? searchParams.city_id : '';
  const REGION_ID =
    searchParams?.region_id && typeof searchParams?.region_id === 'string'
      ? searchParams.region_id
      : '';
  const CREATED_AT =
    searchParams?.created_at && typeof searchParams?.created_at === 'string'
      ? searchParams.created_at
      : '';
  const VEHICLE_TYPE =
    searchParams?.vehicle_type && typeof searchParams?.vehicle_type === 'string'
      ? searchParams.vehicle_type
      : '';
  const PAGE =
    searchParams?.page && typeof searchParams?.page === 'string' ? searchParams.page : '1';
  const LIMIT =
    searchParams?.limit && typeof searchParams?.limit === 'string' ? searchParams.limit : '5';
  const { TABLE, META } = await getAllDrivers({
    status: STATUS,
    driver_search: DRIVER_SEARCH,
    country_id: COUNTRY_ID,
    city_id: CITY_ID,
    region_id: REGION_ID,
    created_at: CREATED_AT,
    page: PAGE,
    limit: LIMIT,
    vehicle_type: VEHICLE_TYPE,
  });

  const warehouses = await getRequiredWarehouseDataForDrivers();
  const analytics = await getDriversAnalytics();
  const COUNTRIES = await fetchCountries();
  let CITIES = [];
  if (COUNTRY_ID) {
    CITIES = await getCities(COUNTRY_ID);
  }
  let REGIONS = [];
  if (CITY_ID) {
    REGIONS = await getRegions(CITY_ID);
  }
  return (
    <DriversView
      tableContent={TABLE}
      meta={META}
      allCities={CITIES}
      allCountries={COUNTRIES.data.data}
      allRegions={REGIONS}
      analytics={analytics.data}
      warehouses={warehouses}
    />
  );
};

export default Page;

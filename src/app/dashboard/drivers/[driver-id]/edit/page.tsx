import { fetchCountries } from 'src/actions/countries';
import { getCities, getRegions, getSingleDriver } from 'src/actions/drivers-dashboard-actions';

import EditDriverProfile from 'src/sections/drivers/edit-driver-profile';

export const metadata = {
  title: 'Edit-Driver-Profile',
};
const Page = async ({ params }: { params: { [key: string]: string } }) => {
  const DRIVER_ID = params['driver-id'];
  const driverData = await getSingleDriver(DRIVER_ID);
  const COUNTRIES = await fetchCountries();
  const {
    address: {
      country: { id: country_id },
      city: { id: city_id },
    },
  } = driverData;

  let CITIES = [];
  if (country_id) {
    CITIES = await getCities(country_id);
  }
  let REGIONS = [];
  if (city_id) {
    REGIONS = await getRegions(city_id);
  }
  return (
    <EditDriverProfile
      driver={driverData}
      countries={COUNTRIES.data.data}
      cities={CITIES}
      regions={REGIONS}
    />
  );
};
export default Page;

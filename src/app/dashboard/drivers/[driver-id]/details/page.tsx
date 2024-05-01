import { getSingleDriver } from 'src/actions/drivers-dashboard-actions';

import DriverDetailsView from 'src/sections/drivers/driver-details';

export const metadata = {
  title: 'Driver-Details',
};
const Page = async ({ params }: { params: { [key: string]: string } }) => {
  const DRIVER_ID = params['driver-id'];
  const driverData = await getSingleDriver(DRIVER_ID);

  return <DriverDetailsView details={driverData} />;
};
export default Page;

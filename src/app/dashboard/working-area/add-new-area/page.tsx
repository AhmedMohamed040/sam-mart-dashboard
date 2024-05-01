import { getAllCities } from 'src/actions/working-area';

import AddEditWorkingArea from 'src/sections/working-area/add-edit-area';

const Page = async () => {
  const cities = await getAllCities();
  return <AddEditWorkingArea cities={cities} />;
};

export default Page;

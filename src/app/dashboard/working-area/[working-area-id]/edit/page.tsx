import { getAllCities, getSingleWorkArea } from 'src/actions/working-area';

import AddEditWorkingArea from 'src/sections/working-area/add-edit-area';

const Page = async ({ params }: { params: { [key: string]: string } }) => {
  const id = params['working-area-id'];
  const cities = await getAllCities();
  const singleWorkArea = await getSingleWorkArea(id);
  return <AddEditWorkingArea workArea={singleWorkArea} cities={cities} />;
};

export default Page;

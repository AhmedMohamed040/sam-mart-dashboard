import { getTableContent, getWorkingAreaNames } from 'src/actions/working-area';

import WorkingAreaView from 'src/sections/working-area/view';

export const metadata = {
  title: 'Working-Area',
};
type props = {
  searchParams: { [key: string]: string | undefined };
};
const Page = async ({ searchParams }: props) => {
  const { search } = searchParams;
  const areaNames = await getWorkingAreaNames(search as string);
  const tableContent = await getTableContent(search);
  return <WorkingAreaView names={areaNames} tableContent={tableContent} />;
};

export default Page;

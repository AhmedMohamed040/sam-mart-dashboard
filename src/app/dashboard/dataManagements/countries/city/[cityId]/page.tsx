import { fetchRegions } from 'src/actions/region-actions';
import { fetchSingleCity } from 'src/actions/cities-actions';

import CityDetails from 'src/sections/countries/city-details';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Country: details',
};

type props = {
  params: {
  cityId:string
  };
};
export default async function Page({ params }: props) {
  const {cityId} = params;
  const city = await fetchSingleCity({city_id:cityId});
  const regions = await fetchRegions({city_id:cityId});
  return (
    <CityDetails city={city} regions={regions}  />
  );
}

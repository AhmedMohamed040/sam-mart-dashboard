import { fetchCities } from 'src/actions/cities-actions';
import { fetchSingleCountry } from 'src/actions/countries';

import CountryDetails from 'src/sections/countries/country-details';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Country: details',
};

type props = {
  params: {
    countryId: string;
  };
};
export default async function Page({ params }: props) {
  const { countryId } = params;
  const cities = await fetchCities({ country_id: countryId });
  const country = await fetchSingleCountry({ id: countryId });
  return <CountryDetails cities={cities.data} country={country.data} />;
}

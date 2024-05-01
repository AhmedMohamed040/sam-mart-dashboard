import { fetchCountries } from 'src/actions/countries';

import CountriesView from '../../../../sections/countries/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Countries',
};

export default async function Page() {
  const res = await fetchCountries();
  return <CountriesView countries={res?.data?.data} />;
}

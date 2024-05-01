import { fetchUnits } from 'src/actions/units-actions';

import UnitsView from 'src/sections/units/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Units',
};

export default async function Page() {
  const res = await fetchUnits();
  return <UnitsView units={res} />;
}

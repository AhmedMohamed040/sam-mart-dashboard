import { fetchServices } from 'src/actions/additional-services-actions';

import ServicesView from 'src/sections/additional-services/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Additional services',
};

export default async function Page() {
  const res = await fetchServices();
  return <ServicesView services={res?.data?.data} />;
}

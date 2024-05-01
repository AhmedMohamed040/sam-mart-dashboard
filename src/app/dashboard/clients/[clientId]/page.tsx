import { fetchSingleClient } from 'src/actions/clients-actions';

import ClientDetails from 'src/sections/clients/client-details/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Client: details',
};

interface Props {
  params: {
    clientId: string;
  };
}

export default async function Page({ params }: Props) {
  const { clientId } = params;
  const client = (await fetchSingleClient(clientId))?.data;

  return <ClientDetails client={client} />;
}

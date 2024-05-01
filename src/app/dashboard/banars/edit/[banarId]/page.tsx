import { fetchSingleBanar } from 'src/actions/banars-actions';

import BanarCreateView from 'src/sections/banars/banar-form/view/banar-create-view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Edit Banar',
};

type Props = {
  params: {
    banarId: string;
  };
};
type Headers = {
  banarId: string;
};

export default async function Page({ params }: Props) {
  const headers: Headers = {
    banarId: params.banarId,
  };
  const data = await fetchSingleBanar(headers);
  return <BanarCreateView banar={data} />;
}

import { fetchSingleSection } from 'src/actions/sections-actions';

import { SectionCreateView } from 'src/sections/sections/section-form/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Edit Section',
};

type props = {
  params: {
    sectionId: string;
  };
};
interface Headers {
  sectionId: string;
}
export default async function Page({ params }: props) {
  const headers: Headers = {
    sectionId: params.sectionId,
  };
  const data = await fetchSingleSection(headers);
  return <SectionCreateView section={data} />;
}

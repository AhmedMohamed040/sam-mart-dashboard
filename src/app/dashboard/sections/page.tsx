import { fetchSections } from 'src/actions/sections-actions';

import SectionsView from 'src/sections/sections/view';

import { User } from 'src/types/user';

import { useUser } from '../../../hooks/use-user';

export const metadata = {
  title: 'Sections',
};

export default async function Page() {
  const user: User = useUser();
  const sections = await fetchSections({
    user_id: user.id,
  });
  return <SectionsView sections={sections.data.data} />;
}

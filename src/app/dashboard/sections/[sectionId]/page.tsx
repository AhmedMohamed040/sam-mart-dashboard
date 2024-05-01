import { getCatsForLinkingModal } from 'src/actions/categories-actions';
import { fetchSingleSection, fetchSectionCategories } from 'src/actions/sections-actions';

import SectionCategoryDetails from 'src/sections/sections/section-details';
import CustomAutoCompelete from 'src/sections/sections/link-section-to-category/Linking-Modal/AutoCompelete';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Section: details',
};

type props = {
  params: {
    sectionId: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
};
interface Headers {
  sectionId: string;
}
export default async function Page({ params, searchParams }: props) {
  const headers: Headers = {
    sectionId: params.sectionId,
  };
  const section = await fetchSingleSection(headers);

  const sectionCategories = await fetchSectionCategories(headers);
  return (
    <SectionCategoryDetails section={section} categories={sectionCategories}>
      <CustomAutoCompelete
        fetchItems={getCatsForLinkingModal}
        label="category"
        placeholder="choose a category"
        name="category_id"
      />
    </SectionCategoryDetails>
  );
}

import { fetchStaticPage } from 'src/actions/static-page-actions';

import StaticPageView from 'src/sections/static-page/view';

export const metadata = {
  title: 'Return Policy',
};

export default async function Page() {
  const type = 'RETURN_POLICY';

  const { content_ar, content_en } = await fetchStaticPage(type);

  const description = {
    ar: content_ar,
    en: content_en,
  };

  return <StaticPageView type={type} description={description} />;
}

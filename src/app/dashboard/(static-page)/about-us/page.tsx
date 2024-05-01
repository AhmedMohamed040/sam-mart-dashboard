import { fetchStaticPage } from 'src/actions/static-page-actions';

import StaticPageView from 'src/sections/static-page/view';

export const metadata = {
  title: 'About Us',
};

export default async function Page() {
  const type = 'ABOUT_US';

  const { content_ar, content_en } = await fetchStaticPage(type);

  const description = {
    ar: content_ar,
    en: content_en,
  };

  return <StaticPageView type={type} description={description} />;
}

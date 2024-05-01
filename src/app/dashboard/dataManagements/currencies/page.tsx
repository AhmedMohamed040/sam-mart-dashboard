import CurrenciesView from 'src/sections/currencies/view';
// ----------------------------------------------------------------------

export const metadata = {
  title: 'Currencies',
};

export default async function Page() {
  return <CurrenciesView />;
}

import Button from '@mui/material/Button';

import { useBoolean } from 'src/hooks/use-boolean';

import { useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';

import NewEditCurrency from './new-edit-form';

const CurrenciesHeader = () => {
  const { t } = useTranslate();
  const confirm = useBoolean();
  const addCurrency = (
    <Button
      variant="contained"
      startIcon={<Iconify icon="ic:baseline-plus" />}
      onClick={confirm.onTrue}
    >
      {t('add_new_currency')}
    </Button>
  );
  return (
    <>
      <CustomBreadcrumbs
        heading={t('currencies')}
        links={[{}]}
        action={addCurrency}
        sx={{ mb: 4 }}
      />
      <NewEditCurrency open={confirm.value} onClose={confirm.onFalse} />
    </>
  );
};

export default CurrenciesHeader;

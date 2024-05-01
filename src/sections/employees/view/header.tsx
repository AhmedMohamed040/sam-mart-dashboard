import Button from '@mui/material/Button';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useTranslate } from 'src/locales';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';

const EmployeesViewHeader = () => {
  const { t } = useTranslate();
  const EmployeesActions = (
    <Button
      variant="contained"
      LinkComponent={RouterLink}
      href={`${paths.dashboard.employees}/new-employee`}
    >
      {t('add_employee')}
    </Button>
  );
  return <CustomBreadcrumbs heading={t('employees')} links={[{}]} action={EmployeesActions} />;
};
export default EmployeesViewHeader;

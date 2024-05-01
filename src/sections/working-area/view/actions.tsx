import Button from '@mui/material/Button';

import { RouterLink } from 'src/routes/components';

import { useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

const WorkingAreaViewActions = ({ areaNames }: { areaNames: string[] }) => {
  const { t } = useTranslate();

  return (
    <CustomBreadcrumbs
      heading={t('working_areas')}
      links={[{}]}
      action={
        <Button
          LinkComponent={RouterLink}
          href="/dashboard/working-area/add-new-area"
          variant="contained"
          startIcon={<Iconify icon="ic:baseline-plus" />}
        >
          {t('add_new_area')}
        </Button>
      }
    />
  );
};

export default WorkingAreaViewActions;

'use client';

import { useForm } from 'react-hook-form';

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';

import type { TableContent } from 'src/@types/working-area';

import FormProvider from 'src/components/hook-form/form-provider';

import WorkingAreaViewActions from './actions';
import WorkingAreaViewTable from './table-of-areas';

const WorkingAreaView = ({
  names,
  tableContent,
}: {
  names: string[];
  tableContent: TableContent[];
}) => {
  const methods = useForm({
    defaultValues: {
      working_areas: '',
    },
  });
  return (
    <Container maxWidth="xl">
      <Stack gap={4}>
        <FormProvider methods={methods} onSubmit={() => {}}>
          <WorkingAreaViewActions areaNames={names} />
        </FormProvider>
        <WorkingAreaViewTable tableData={tableContent} />
      </Stack>
    </Container>
  );
};

export default WorkingAreaView;

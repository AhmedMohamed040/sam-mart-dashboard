import { useMemo } from 'react';

import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';

import uuidv4 from 'src/utils/uuidv4';

import { useTranslate } from 'src/locales';

import Scrollbar from 'src/components/scrollbar';
import { TableHeadCustom } from 'src/components/table';
import { RHFCheckbox } from 'src/components/hook-form';

const TABLE_DATA = [
  {
    id: uuidv4(),
    title: 'accounting',
    name: 'accounting',
  },
  {
    id: uuidv4(),
    title: 'hr',
    name: 'hr',
  },
  {
    id: uuidv4(),
    title: 'marketing',
    name: 'marketing',
  },
  {
    id: uuidv4(),
    title: 'customer_service',
    name: 'customerService',
  },
];

// ----------------------------------------------------------------------

export default function EmployeeSectionsTable() {
  const { t } = useTranslate();

  const TABLE_HEAD = useMemo(
    () => [
      { id: 'section', label: t('section'), align: 'center' },
      { id: 'status', label: t('status'), align: 'center' },
    ],
    [t]
  );
  return (
    <Box>
      <Typography variant="h4" gutterBottom mb={5}>
        {t('employee_placement_in_departments')}
      </Typography>
      <TableContainer sx={{ mt: 3, overflow: 'unset' }}>
        <Scrollbar>
          <Table sx={{ minWidth: 800 }}>
            <TableHeadCustom headLabel={TABLE_HEAD} />

            <TableBody>
              {TABLE_DATA.map((row) => (
                <TableRow hover key={row.id}>
                  <TableCell align="center">{t(row.title)}</TableCell>
                  <TableCell align="center">
                    <RHFCheckbox
                      name={`departements.${row.name}`}
                      label=""
                      sx={{ padding: 0, margin: 0 }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>
    </Box>
  );
}

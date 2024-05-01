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
import { RHFSwitch } from 'src/components/hook-form';
import { TableHeadCustom } from 'src/components/table';

const TABLE_DATA = [
  {
    id: uuidv4(),
    title: 'sections',
    name: 'permissions.sections',
    vals: ['view', 'add', 'edit', 'delete'],
  },
  {
    id: uuidv4(),
    title: 'categories',
    name: 'permissions.categories',
    vals: ['view', 'add', 'edit', 'delete'],
  },
  {
    id: uuidv4(),
    title: 'sub_categories',
    name: 'permissions.sub_categories',
    vals: ['view', 'add', 'edit', 'delete'],
  },
  {
    id: uuidv4(),
    title: 'products',
    name: 'permissions.products',
    vals: ['view', 'add', 'edit', 'delete'],
  },
  {
    id: uuidv4(),
    title: 'clients',
    name: 'permissions.clients',
    vals: ['view', 'add', 'edit', 'delete'],
  },
  {
    id: uuidv4(),
    title: 'clients_wallet',
    name: 'permissions.clientsWallet',
    vals: ['view', 'add', 'edit', 'delete'],
  },
  {
    id: uuidv4(),
    title: 'orders',
    name: 'permissions.orders',
    vals: ['view', 'add', 'edit', 'delete'],
  },
  {
    id: uuidv4(),
    title: 'offers',
    name: 'permissions.offers',
    vals: ['view', 'add', 'edit', 'delete'],
  },
  {
    id: uuidv4(),
    title: 'coupons_and_discounts',
    name: 'permissions.couponsAndDiscounts',
    vals: ['view', 'add', 'edit', 'delete'],
  },
  {
    id: uuidv4(),
    title: 'employees',
    name: 'permissions.employees',
    vals: ['view', 'add', 'edit', 'delete'],
  },
  {
    id: uuidv4(),
    title: 'drivers',
    name: 'permissions.drivers',
    vals: ['view', 'add', 'edit', 'delete'],
  },
  {
    id: uuidv4(),
    title: 'drivers_wallet',
    name: 'permissions.driversWallet',
    vals: ['view', 'add', 'edit', 'delete'],
  },
  {
    id: uuidv4(),
    title: 'warehouses',
    name: 'permissions.warehouses',
    vals: ['view', 'add', 'edit', 'delete'],
  },
  {
    id: uuidv4(),
    title: 'transactions',
    name: 'permissions.transactions',
    vals: ['view', 'add', 'edit', 'delete'],
  },
  {
    id: uuidv4(),
    title: 'return_requests',
    name: 'permissions.returnRequests',
    vals: ['view', 'add', 'edit', 'delete'],
  },
  {
    id: uuidv4(),
    title: 'notifications',
    name: 'permissions.notifications',
    vals: ['view', 'add', 'edit', 'delete'],
  },
  {
    id: uuidv4(),
    title: 'advertisements',
    name: 'permissions.advertisements',
    vals: ['view', 'add', 'edit', 'delete'],
  },
  {
    id: uuidv4(),
    title: 'currencies',
    name: 'permissions.currencies',
    vals: ['view', 'add', 'edit', 'delete'],
  },
  {
    id: uuidv4(),
    title: 'reports',
    name: 'permissions.reports',
    vals: ['view', 'add', 'edit', 'delete'],
  },
];

// ----------------------------------------------------------------------

export default function EmployeePermissionsTable() {
  const { t } = useTranslate();

  const TABLE_HEAD = useMemo(
    () => [
      { id: 'empty', label: '' },
      { id: 'view', label: t('view'), align: 'center' },
      { id: 'add', label: t('add'), align: 'center' },
      { id: 'edit', label: t('edit'), align: 'center' },
      { id: 'delete', label: t('delete'), align: 'center' },
    ],
    [t]
  );
  return (
    <Box>
      <Typography variant="h4" gutterBottom mb={5}>
        {t('permissions')}
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
                    <RHFSwitch
                      name={`${row.name}.${row.vals[0]}`}
                      label=""
                      sx={{ padding: 0, margin: 0 }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <RHFSwitch
                      name={`${row.name}.${row.vals[1]}`}
                      label=""
                      sx={{ padding: 0, margin: 0 }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <RHFSwitch
                      name={`${row.name}.${row.vals[2]}`}
                      label=""
                      sx={{ padding: 0, margin: 0 }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <RHFSwitch
                      name={`${row.name}.${row.vals[3]}`}
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

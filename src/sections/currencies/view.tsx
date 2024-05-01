'use client';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import CurrenciesTable from './table';
import CurrenciesHeader from './header';

function CurrenciesView() {
  return (
    <Container maxWidth="xl">
      <Typography
        textAlign="center"
        variant="h4"
        sx={{
          backgroundColor: 'warning.main',
          color: 'primary.main',
          padding: 4,
          mb: 4,
          borderRadius: 1,
        }}
      >
        الصفحة حالياً مجرد تصميم و بيانات وهمية و في انتظار الباك-اند فقط للأنتهاء منها
      </Typography>
      <CurrenciesHeader />
      <CurrenciesTable />
    </Container>
  );
}

export default CurrenciesView;

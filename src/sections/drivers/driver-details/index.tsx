'use client';

import Container from '@mui/material/Container';

import { SingleDriver } from 'src/@types/dashboard-drivers';

import DriverDetails from './content';

const DriverDetailsView = ({ details }: { details: SingleDriver }) => (
  <Container maxWidth="xl">
    <DriverDetails details={details} />
  </Container>
);

export default DriverDetailsView;

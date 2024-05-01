import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';

import { getCustomNameKeyLang } from 'src/utils/helperfunction';

import { useTranslate } from 'src/locales';
import { Services } from 'src/@types/services';
import { ProductMeasurement, ProductAdditionalService } from 'src/@types/products';

import Iconify from 'src/components/iconify/iconify';

import SingleServiceForm from './singleServiceForm';

interface IProps {
  measurement: ProductMeasurement;
  product_id: string;
  services: Services[];
}

function AddServiceToMeasurement({ measurement, product_id, services }: IProps) {
  const [newMeasurementService, setNewMeasurementService] = useState<
    ProductAdditionalService[] | undefined
  >(measurement?.product_additional_services);
  const { t } = useTranslate();

  const restServices = useCallback(() => {
    if (services && newMeasurementService) {
      return services?.filter(
        (service) =>
          !newMeasurementService
            ?.map((addedService) => addedService?.additional_service?.additional_service_id)
            ?.includes(service?.id)
      );
    }
    return [];
  }, [newMeasurementService, services]);

  const handleAddNewService = useCallback(() => {
    // Do nothing if there is already a new service
    if (newMeasurementService && measurement?.product_additional_services)
      if (!restServices()?.length) {
        return;
      }
    if (newMeasurementService !== undefined && newMeasurementService?.length) {
      setNewMeasurementService([
        ...newMeasurementService,
        {
          product_additional_service_id: '',
          price: '0',
          additional_service: {
            additional_service_id: '',
            name_ar: '',
            name_en: '',
          },
        },
      ]);
    } else {
      setNewMeasurementService([
        {
          product_additional_service_id: '',
          price: '0',
          additional_service: {
            additional_service_id: '',
            name_ar: '',
            name_en: '',
          },
        },
      ]);
    }
  }, [measurement?.product_additional_services, newMeasurementService, restServices]);

  const RemoveService = useCallback(
    (additional_service_id: string) => {
      const rest = newMeasurementService?.filter(
        (service) => service?.additional_service?.additional_service_id !== additional_service_id
      );
      setNewMeasurementService(rest);
    },
    [newMeasurementService]
  );
  const AddService = useCallback(
    (Service: ProductAdditionalService) => {
      if (newMeasurementService !== undefined && newMeasurementService?.length) {
        const rest = newMeasurementService?.filter(
          (service) => service?.additional_service?.additional_service_id !== ''
        );
        setNewMeasurementService([...rest, Service]);
      } else {
        setNewMeasurementService([Service]);
      }
    },
    [newMeasurementService]
  );

  return (
    <Box
      display="flex"
      alignItems="start"
      justifyContent="start"
      flexWrap="wrap"
      key={measurement?.product_measurement_id}
      order={measurement?.is_main_unit ? 0 : 1}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: '12%' }}>
        <InputLabel>{measurement?.is_main_unit ? t('main_unit') : t('sub_unit')}</InputLabel>
        <Typography variant="subtitle2">
          {getCustomNameKeyLang(measurement?.measurement_unit_en, measurement?.measurement_unit_ar)}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          <Button
            variant="outlined"
            onClick={() => handleAddNewService()}
            sx={{ p: 1, mx: -1, width: '1px !important' }}
          >
            <Iconify icon="mingcute:add-line" width={16} />
          </Button>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          alignItems: 'flex-start',
          flexGrow: 1,
        }}
      >
        {newMeasurementService?.map((service) => (
          <Box
            sx={{ my: 2, minWidth: '100%', flexGrow: '1' }}
            key={service.product_additional_service_id}
          >
            <SingleServiceForm
              price={Number(service?.price)}
              services={services}
              restServices={restServices()}
              additional_service_id={service?.additional_service?.additional_service_id}
              product_measurement_id={measurement?.product_measurement_id}
              product_sub_category_id={product_id}
              product_additional_service_id={service?.product_additional_service_id}
              RemoveService={RemoveService}
              AddService={AddService}
            />
          </Box>
        ))}
      </Box>
      <Divider sx={{ my: 2, width: '100%' }} />
    </Box>
  );
}

export default AddServiceToMeasurement;

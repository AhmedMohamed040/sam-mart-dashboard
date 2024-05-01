import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import LoadingButton from '@mui/lab/LoadingButton';

import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { getNameKeyLang, getCustomNameKeyLang } from 'src/utils/helperfunction';

import { Units } from 'src/@types/units';
import { useTranslate } from 'src/locales';
import { ProductMeasurement } from 'src/@types/products';
import {
  addProductUnit,
  deleteProductUnit,
  editProductMeasures,
} from 'src/actions/product-actions';

import FormProvider from 'src/components/hook-form';
import { useSnackbar } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';

// ----------------------------------------------------------------------
export interface IProductForm {
  id?: string;
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  is_active: boolean;
  is_recovered: boolean;
  product_images: ProductImage[];
  measurements: Measurement[];
}

export interface ProductImage {
  url: string;
  is_logo: boolean;
}

export interface Measurement {
  conversion_factor: number;
  measurement_unit_id: string;
  is_main_unit: boolean;
}

type Props = {
  product_measurements?: ProductMeasurement[];
  units: Units[];
  product_id: string;
};
export interface IDataBodyMeasure {
  conversion_factor: number;
  is_main_unit: boolean;
}

export default function ProductEditMeasure({ product_id, product_measurements, units }: Props) {
  const { t } = useTranslate();
  const [showAddInputs, setShowAddInputs] = useState(false);
  const confirm = useBoolean();
  const [deleteUnit, setDeleteUnit] = useState({
    product_measurement_id: '',
    product_id: '',
  });
  const [newUnit, setNewUnit] = useState({
    measurement_unit_id: '',
    conversion_factor: 0,
    is_main_unit: false,
  });
  const [measurements, setMeasurements] = useState(
    product_measurements?.map((measurement: ProductMeasurement) => ({
      unitId: measurement.measurement_unit_id,
      factor: measurement.conversion_factor as unknown as string,
      isMain: measurement.is_main_unit,
      productMeasurementUnitId: measurement.product_measurement_id,
    })) || []
  );

  const { enqueueSnackbar } = useSnackbar();

  const methods = useForm();

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    setMeasurements(
      product_measurements?.map((product_measurement) => ({
        unitId: product_measurement.measurement_unit_id,
        factor: product_measurement.conversion_factor as unknown as string,
        isMain: product_measurement.is_main_unit,
        productMeasurementUnitId: product_measurement.product_measurement_id,
      })) || []
    );
    setNewUnit({
      measurement_unit_id: '',
      conversion_factor: 0,
      is_main_unit: false,
    });
  }, [product_measurements]);
  const router = useRouter();
  const onSubmitMeasure = handleSubmit(async () => {
    if (newUnit.measurement_unit_id && newUnit.conversion_factor && !newUnit.is_main_unit) {
      const res: any = await addProductUnit(newUnit, product_id);
      if (res?.error) {
        enqueueSnackbar(`${res?.error}`, { variant: 'error' });
      } else {
        enqueueSnackbar(t('Added success!'));
      }
    } else {
      measurements.forEach(async (measurement) => {
        const dataBody: IDataBodyMeasure = {
          conversion_factor: measurement.factor as unknown as number,
          is_main_unit: measurement.isMain,
        };

        const res = await editProductMeasures({
          productId: product_id,
          dataBody,
          productMeasurementUnitId: measurement.productMeasurementUnitId as string,
        });
        if (res?.error) {
          enqueueSnackbar(`${res?.error}`, { variant: 'error' });
        } else {
          enqueueSnackbar(t('Update success!'));
          router.back();
        }
      });
    }
  });
  const handleConfirmDelete = async () => {
    try {
      await deleteProductUnit(deleteUnit?.product_measurement_id, deleteUnit?.product_id);

      enqueueSnackbar(t('Deleted success!'));
      confirm.onFalse();
    } catch (error) {
      console.error(error);
      enqueueSnackbar(t(error.message));
    }
  };
  const mainUnitIndex = measurements.findIndex((s) => s.isMain);
  const reorderedState = [
    measurements[mainUnitIndex], // Main unit comes first
    ...measurements.slice(0, mainUnitIndex), // Remaining elements before main unit
    ...measurements.slice(mainUnitIndex + 1), // Remaining elements after main unit
  ];
  return (
    <FormProvider methods={methods} onSubmit={onSubmitMeasure}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ p: 3, width: '100%' }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)', // 9 parts: 8 for input field and 1 for delete button
              }}
              sx={{ width: '100%', marginY: '10px' }}
              position="relative"
            >
              {reorderedState?.map((unit, index) => (
                <>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <InputLabel id={index as unknown as string}>
                      {unit?.isMain ? t('main_unit') : t('sub_unit')}
                    </InputLabel>
                    <Select
                      key={index}
                      disabled
                      labelId={index as unknown as string}
                      value={unit?.unitId} // Set the value of the Select to the unitId
                      onChange={(event) => {
                        const { value } = event.target;
                        setMeasurements((prevState) => {
                          const newState = [...prevState];
                          newState[index] = { ...newState[index], unitId: value }; // Update unitId in state
                          return newState;
                        });
                      }}
                    >
                      {units.map((_unit, j) => (
                        <MenuItem key={j} value={_unit?.id}>
                          {getCustomNameKeyLang(_unit?.name_en, _unit?.name_ar)}
                        </MenuItem>
                      ))}
                    </Select>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ width: '100%' }}>
                      <InputLabel>{t('unit')} </InputLabel>
                      <TextField
                        disabled={unit?.isMain}
                        type="number"
                        value={unit?.factor}
                        sx={{ width: '100%' }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        onChange={(event) => {
                          const { value } = event.target;
                          setMeasurements((prevState) => {
                            const newState = [...reorderedState];
                            newState[index] = { ...newState[index], factor: value };
                            return newState;
                          });
                        }}
                      />
                    </Box>
                    {!unit?.isMain && (
                      <Button
                        sx={{
                          gridColumn: {
                            xs: '1',
                            sm: '3',
                          },
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '17px',
                          marginTop: '20px',
                        }}
                        onClick={() => {
                          confirm.onTrue();
                          setDeleteUnit({
                            product_id,
                            product_measurement_id: unit?.productMeasurementUnitId,
                          });
                        }}
                      >
                        X
                      </Button>
                    )}
                  </Box>
                </>
              ))}
              {!showAddInputs && (
                <Button
                  variant="contained"
                  sx={{ marginRight: '10px', width: 'fit-content' }}
                  onClick={() => setShowAddInputs(true)}
                >
                  {t('add_new_unit')}
                </Button>
              )}
              {showAddInputs && (
                <>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <InputLabel>{t('sub_unit')}</InputLabel>
                    <Select
                      value={newUnit.measurement_unit_id}
                      onChange={(event) =>
                        setNewUnit((prev) => ({
                          ...prev,
                          measurement_unit_id: event.target.value as string,
                        }))
                      }
                    >
                      {units.map((u, j) => (
                        <MenuItem key={j} value={u?.id}>
                          {u[getNameKeyLang()]}
                        </MenuItem>
                      ))}
                    </Select>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                      <InputLabel>{t('unit')}</InputLabel>
                      <TextField
                        type="number"
                        value={newUnit.conversion_factor}
                        sx={{ width: '100%' }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        onChange={(event) => {
                          const { value } = event.target;
                          setNewUnit((prevState) => {
                            let newState = prevState;
                            newState = { ...newState, conversion_factor: parseFloat(value) };
                            return newState;
                          });
                        }}
                      />
                    </Box>
                    <Button
                      sx={{
                        gridColumn: {
                          xs: '1',
                          sm: '3',
                        },
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '17px',
                        marginTop: '20px',
                      }}
                      onClick={() => {
                        setShowAddInputs(false);
                      }}
                    >
                      X
                    </Button>
                  </Box>
                </>
              )}
            </Box>
            <ConfirmDialog
              open={confirm.value}
              onClose={confirm.onFalse}
              title={t('delete')}
              content={t('delete_confirm')}
              action={
                <Button variant="contained" color="error" onClick={handleConfirmDelete}>
                  {t('delete')}
                </Button>
              }
            />
            <Stack sx={{ mt: 3, display: 'flex', justifyContent: ' end', flexDirection: 'row' }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!product_measurements ? t('add') : t('save')}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

import axios from 'axios';
import { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';

import { useLocales, useTranslate } from 'src/locales';

import { GoogleMap } from 'src/components/map';

import { Position } from 'src/types/map';

const WorkingAreaMap = ({ getMapData, defaultPos }: any) => {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const methods = useFormContext();
  const {
    formState: { errors },
    setValue,
  } = methods;
  const [currentPosition, setCurrentPosition] = useState<Position>();
  useEffect(() => {
    const fetchAddress = async (language: string) => {
      try {
        const res = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${currentPosition?.lat},${currentPosition?.lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}&language=${language}`
        );
        return res.data.results[0].formatted_address;
      } catch (error) {
        console.error(error);
        return '';
      }
    };

    const fetchAddresses = async () => {
      const arAddress = await fetchAddress('ar');
      const enAddress = await fetchAddress('en');
      getMapData({
        coords: currentPosition,
        address: { add_ar: arAddress, add_en: enAddress },
      });
      setValue('address', currentLang.value === 'en' ? enAddress : arAddress, {
        shouldValidate: true,
      });
    };

    if (currentPosition) {
      fetchAddresses();
    }
  }, [currentPosition, getMapData, setValue, currentLang]);
  return (
    <Card sx={{ p: 3, ml: 3, mb: 1 }}>
      <Box sx={{ height: 'min(30rem, 90vw)', mb: 1 }}>
        <GoogleMap
          defaultPosition={currentPosition || defaultPos}
          setCurrentPosition={(p) => {
            setCurrentPosition(p);
          }}
        />
      </Box>
      {/* Address */}
      {/* {true ? <Typography>adress</Typography> : null} */}
      {/* Map Error Msg */}
      {errors?.geo_location?.message && !currentPosition ? (
        <Typography variant="subtitle1" color="error">
          {t('map_error')}
        </Typography>
      ) : null}
    </Card>
  );
};

export default WorkingAreaMap;

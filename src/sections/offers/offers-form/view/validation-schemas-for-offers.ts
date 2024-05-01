import * as Yup from 'yup';
import { t } from 'i18next';
import { isAfter, parseISO } from 'date-fns';

import { fDate } from 'src/utils/format-time';

const quantityStandards = Yup.number()
  .integer(t('Quantity must be an integer'))
  .positive(t('Quantity must be positive'))
  .required(t('Quantity is required'));

export const minOrderQuantityCheckTest = quantityStandards.test(
  'minQuantityCheck',
  (value, context) => {
    const { maxOrderQuantity, quantity } = context.parent;
    const { createError, path } = context;
    if (value > quantity && value > maxOrderQuantity) {
      return createError({
        message: t(
          "min_quantity_can't_be_higher_than_the_max_order_quantity_or_the_order_quantity_of_the_offer"
        ),
        path,
      });
    }
    if (value > quantity)
      return createError({
        message: t("min_quantity_can't_be_higher_than_the_quantity_of_the_offer"),
        path,
      });
    if (value > maxOrderQuantity)
      return createError({
        message: t("min_quantity_can't_be_higher_than_the_max_order_quantity"),
        path,
      });
    return true;
  }
);
export const maxOrderQuantityCheckTest = quantityStandards.test(
  'maxQuantityCheck',
  (value, context) => {
    const { minOrderQuantity, quantity } = context.parent;
    const { createError, path } = context;
    if (value > quantity)
      return createError({
        message: t("max_quantity_order_can't_be_higher_than_the_quantity_of_the_offer"),
        path,
      });
    if (value < minOrderQuantity)
      return createError({
        message: t("max_quantity_order_can't_be_less_than_min_quantity_order"),
      });

    return true;
  }
);

export const quantityCheckTest = quantityStandards.test(
  'quantityCheck',
  t('quantity_should_be_higher_than_both_max_quantity_order_and_min_quantity_order'),
  (value, context) => {
    const { minOrderQuantity, maxOrderQuantity } = context.parent;
    return value >= minOrderQuantity && value >= maxOrderQuantity;
  }
);

export const discountValueCheckTest = Yup.number()
  .required(t('discount_value_is_required'))
  .integer(t('must_be_an_integer'))
  .test('discountValueCheck', (value, context) => {
    const {
      unitPrice,
      discountType: { name },
    } = context.parent;
    const { createError, path } = context;
    console.log(value);
    if (!+value)
      return createError({
        message: t('discount_value_is_required'),
        path,
      });

    if (name === 'VALUE' && +value > +unitPrice)
      return createError({
        message: t("discount_can't_exceed_the_unit_price"),
        path,
      });

    if (name === 'PERCENTAGE' && +value > 100)
      return createError({ message: t("discount_percentage_can't_be_higher_than_100%"), path });
    return true;
  })
  .positive(t('must_be_positive'));

export const startDateCheckTest = Yup.string()
  .required(t('start_date_is_required'))
  .test('startDateCheck', (value, context) => {
    const { createError, path } = context;
    const { endDate } = context.parent;
    if (endDate && value) {
      const start = parseISO(fDate(new Date(value)));
      const end = parseISO(fDate(new Date(endDate)));
      if (isAfter(start, end)) {
        return createError({ message: t("start_date_can't_be_after_end_date", path) });
      }
    }
    return true;
  });

export const endDateCheckTest = Yup.string()
  .required(t('end_date_is_required'))
  .test('endDateCheck', (value, context) => {
    const { createError, path } = context;
    const { startDate } = context.parent;
    if (startDate && value) {
      const start = parseISO(fDate(new Date(startDate)));
      const end = parseISO(fDate(new Date(value)));
      if (isAfter(start, end)) {
        return createError({ message: t('end_date_should_be_after_start_date', path) });
      }
    }
    return true;
  });

import type { IntlShape } from 'react-intl'
import { z } from 'zod'

export function nameSchema(intl: IntlShape) {
  return z
    .string()
    .trim()
    .min(2, { message: `${intl.formatMessage({ id: 'nameMinRequired' })} 2 ${intl.formatMessage({ id: 'characters' })}` })
    .max(32, { message: `${intl.formatMessage({ id: 'nameMaxRequired' })} 32 ${intl.formatMessage({ id: 'characters' })}` })
}

export function descriptionSchema(intl: IntlShape) {
  return z
    .string()
    .trim()
    .min(2, { message: `${intl.formatMessage({ id: 'descriptionMinRequired' })} 2 ${intl.formatMessage({ id: 'characters' })}` })
    .max(350, { message: `${intl.formatMessage({ id: 'descriptionMaxRequired' })} 350 ${intl.formatMessage({ id: 'characters' })}` })
    .optional()
    .or(z.literal(''))
}

export function descriptionRequiredSchema(intl: IntlShape) {
  return z
    .string()
    .trim()
    .min(2, { message: `${intl.formatMessage({ id: 'descriptionMinRequired' })} 2 ${intl.formatMessage({ id: 'characters' })}` })
    .max(350, { message: `${intl.formatMessage({ id: 'descriptionMaxRequired' })} 350 ${intl.formatMessage({ id: 'characters' })}` })
}

export function amountAccountSchema(intl: IntlShape) {
  return z
    .number()
    .min(0, { message: intl.formatMessage({ id: 'amountMinRequired' }) })
}

export function amountSchema(intl: IntlShape) {
  return z
    .number()
    .min(0.01, { message: intl.formatMessage({ id: 'amountMinRequired' }) })
}

export function actionDateSchema(intl: IntlShape) {
  return z
    .date()
    .refine(date => date < new Date(), { message: intl.formatMessage({ id: 'actionDateRequired' }) })
}

// TODO: Validating from a List Dynamically
export function accountSchema(intl: IntlShape) {
  return z
    .string()
    .min(1, { message: intl.formatMessage({ id: 'accountIsRequired' }) })
}

// TODO: Validating from a List
export function ratingSchema(intl: IntlShape) {
  return z
    .string()
    .min(1, { message: intl.formatMessage({ id: 'ratingIsRequired' }) })
}

// TODO: Validating from a List Dynamically
export function categorySchema(intl: IntlShape) {
  return z
    .string()
    .min(1, { message: intl.formatMessage({ id: 'categoryIsRequired' }) })
}

export function colorSchema(intl: IntlShape) {
  const hexRegex = /^#(?:[0-9A-F]{3}){1,2}$/i

  return z
    .string()
    .refine(value => hexRegex.test(value), {
      message: intl.formatMessage({ id: 'colorInvalid' }),
    })
}

export function iconSchema(intl: IntlShape) {
  return z
    .string()
    .min(1, { message: intl.formatMessage({ id: 'iconRequired' }) })
}

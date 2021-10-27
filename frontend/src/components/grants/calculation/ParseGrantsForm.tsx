import { NullableGrantRange } from './GrantCalculation';

// eslint-disable-next-line import/prefer-default-export
export const parseFormValues = (values: Record<string, string>) => {
  const formValues = values;
  const sortAndJoinByDefinedOrder = (
    definedOrder: Array<string>,
    arr: Array<string>
  ) => {
    arr.sort((a, b) => definedOrder.indexOf(a) - definedOrder.indexOf(b));

    return arr.join('/');
  };

  Object.keys(formValues).forEach((field) => {
    if (formValues[field] === 'NA') {
      formValues[field] = '';
    }
  });

  const fieldValues = {
    ...formValues,
    singleNationality: formValues.ownNationality,
    coupleNationality: sortAndJoinByDefinedOrder(
      ['SC', 'PR', 'F', ''],
      [formValues.ownNationality, formValues.partnerNationality]
    ),
    singleFirstTimer: formValues.ownFirstTimer,
    coupleFirstTimer: sortAndJoinByDefinedOrder(
      ['true', 'false', ''],
      [formValues.ownFirstTimer, formValues.partnerFirstTimer]
    ),
  };

  return fieldValues;
};

export const getTotalGrant = (allGrants: Array<NullableGrantRange>) => {
  const min = allGrants
    .map((grant) => grant.min)
    .reduce((a, b) => Number(a) + Number(b), 0);
  const max = allGrants
    .map((grant) => grant.max)
    .reduce((a, b) => Number(a) + Number(b), 0);

  return { min, max };
};

export const displayRange = (grantRange: NullableGrantRange) =>
  `$${
    grantRange.min === grantRange.max
      ? grantRange.min
      : `${grantRange.min} - $${grantRange.max}`
  }`;

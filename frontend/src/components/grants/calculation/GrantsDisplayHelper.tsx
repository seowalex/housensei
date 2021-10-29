import { NullableGrantRange } from './GrantCalculation';

export const getTotalGrant = (allGrants: Array<NullableGrantRange>) => {
  const min = allGrants
    .map((grant) => grant.min)
    .reduce((a, b) => Number(a) + Number(b), 0);
  const max = allGrants
    .map((grant) => grant.max)
    .reduce((a, b) => Number(a) + Number(b), 0);

  return { min, max };
};

export const displayGrantRange = (grantRange: NullableGrantRange) => (
  <span style={{ whiteSpace: 'nowrap' }}>
    {`$${
      grantRange.min === grantRange.max
        ? grantRange.min
        : `${grantRange.min} - $${grantRange.max}`
    }`}
  </span>
);

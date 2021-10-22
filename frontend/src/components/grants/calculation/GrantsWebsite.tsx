export const getEHGGrantWebsite = (fieldValues: Record<string, string>) => {
  switch (fieldValues.housingType) {
    case 'Resale':
      return 'https://www.hdb.gov.sg/cs/infoweb/residential/buying-a-flat/resale/financing/cpf-housing-grants/firsttimer-applicants';
    case 'BTO':
      return 'https://www.hdb.gov.sg/cs/infoweb/residential/buying-a-flat/new/schemes-and-grants/cpf-housing-grants-for-hdb-flats/firsttimer-applicants';
    default:
      return '';
  }
};

export const getFamilyGrantWebsite = (fieldValues: Record<string, string>) => {
  switch (fieldValues.housingType) {
    case 'Resale':
      return 'https://www.hdb.gov.sg/cs/infoweb/residential/buying-a-flat/resale/financing/cpf-housing-grants/firsttimer-applicants';
    case 'EC':
      return 'https://www.hdb.gov.sg/cs/infoweb/residential/buying-a-flat/new/schemes-and-grants/cpf-housing-grants-for-ecs';
    default:
      return '';
  }
};

export const getHalfHousingGrantWebsite = (
  fieldValues: Record<string, string>
) => {
  switch (fieldValues.housingType) {
    case 'Resale':
      return 'https://www.hdb.gov.sg/cs/infoweb/residential/buying-a-flat/resale/financing/cpf-housing-grants/firsttimer-and-secondtimer-couple-applicants';
    case 'EC':
      return 'https://www.hdb.gov.sg/cs/infoweb/residential/buying-a-flat/new/schemes-and-grants/cpf-housing-grants-for-ecs';
    default:
      return '';
  }
};

export const getProximityGrantWebsite = () =>
  'https://www.hdb.gov.sg/cs/infoweb/residential/buying-a-flat/resale/financing/cpf-housing-grants/living-with-near-parents-or-child';

export const getSingleEHGGrantWebsite = (
  fieldValues: Record<string, string>
) => {
  const { housingType, coupleFirstTimer, coupleNationality, maritalStatus } =
    fieldValues;

  if (housingType === 'Resale') {
    if (coupleFirstTimer === 'true/false') {
      return 'https://www.hdb.gov.sg/cs/infoweb/residential/buying-a-flat/resale/financing/cpf-housing-grants/firsttimer-and-secondtimer-couple-applicants';
    }
    if (coupleNationality === 'SC/F') {
      return 'https://www.hdb.gov.sg/cs/infoweb/residential/buying-a-flat/resale/financing/cpf-housing-grants/noncitizen-spouse-scheme';
    }
    if (maritalStatus === 'single') {
      return 'https://www.hdb.gov.sg/cs/infoweb/residential/buying-a-flat/resale/financing/cpf-housing-grants/single-singapore-citizen-scheme';
    }
  } else if (housingType === 'BTO') {
    if (coupleFirstTimer === 'true/false') {
      return 'https://www.hdb.gov.sg/cs/infoweb/residential/buying-a-flat/new/schemes-and-grants/cpf-housing-grants-for-hdb-flats/firsttimer-and-secondtimer-couple-applicants';
    }
    if (coupleNationality === 'SC/F') {
      return 'https://www.hdb.gov.sg/cs/infoweb/residential/buying-a-flat/new/schemes-and-grants/cpf-housing-grants-for-hdb-flats/noncitizen-spouse-scheme';
    }
    if (maritalStatus === 'single') {
      return 'https://www.hdb.gov.sg/cs/infoweb/residential/buying-a-flat/new/schemes-and-grants/cpf-housing-grants-for-hdb-flats/single-singapore-citizen-scheme';
    }
  }
  return '';
};

export const getSingleGrantWebsite = (fieldValues: Record<string, string>) => {
  if (fieldValues.maritalStatus === 'single') {
    return 'https://www.hdb.gov.sg/cs/infoweb/residential/buying-a-flat/resale/financing/cpf-housing-grants/single-singapore-citizen-scheme';
  }
  if (fieldValues.coupleNationality === 'SC/F') {
    return 'https://www.hdb.gov.sg/cs/infoweb/residential/buying-a-flat/resale/financing/cpf-housing-grants/noncitizen-spouse-scheme';
  }
  return '';
};

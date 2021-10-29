/* eslint-disable @typescript-eslint/no-explicit-any */

const getLabelLinks = (
  fieldValues: Record<string, string>,
  conditionsAndWebsites: Array<{
    link: string;
    label: string;
    conditions: string[][];
  }>
) => {
  const matchingLinks = conditionsAndWebsites.filter((condition) =>
    condition.conditions.every(
      (miniCondition) =>
        fieldValues[miniCondition[0]] === '' ||
        fieldValues[miniCondition[0]] === miniCondition[1]
    )
  );

  if (matchingLinks.length === 1) {
    return matchingLinks[0].link;
  }

  const matchingLinksObject: Record<string, string> = {};
  matchingLinks.forEach((condition) => {
    matchingLinksObject[condition.label] = condition.link;
  });

  return matchingLinksObject;
};

export const getEHGGrantWebsite = (fieldValues: Record<string, string>) => {
  const resale =
    'https://www.hdb.gov.sg/cs/infoweb/residential/buying-a-flat/resale/financing/cpf-housing-grants/firsttimer-applicants';
  const bto =
    'https://www.hdb.gov.sg/cs/infoweb/residential/buying-a-flat/new/schemes-and-grants/cpf-housing-grants-for-hdb-flats/firsttimer-applicants';
  switch (fieldValues.housingType) {
    case 'Resale':
      return resale;
    case 'BTO':
      return bto;
    default:
      return { Resale: resale, BTO: bto };
  }
};

export const getFamilyGrantWebsite = (fieldValues: Record<string, string>) => {
  const resale =
    'https://www.hdb.gov.sg/cs/infoweb/residential/buying-a-flat/resale/financing/cpf-housing-grants/firsttimer-applicants';
  const ec =
    'https://www.hdb.gov.sg/cs/infoweb/residential/buying-a-flat/new/schemes-and-grants/cpf-housing-grants-for-ecs';
  switch (fieldValues.housingType) {
    case 'Resale':
      return resale;
    case 'EC':
      return ec;
    default:
      return { Resale: resale, EC: ec };
  }
};

export const getHalfHousingGrantWebsite = (
  fieldValues: Record<string, string>
) => {
  const resale =
    'https://www.hdb.gov.sg/cs/infoweb/residential/buying-a-flat/resale/financing/cpf-housing-grants/firsttimer-and-secondtimer-couple-applicants';
  const ec =
    'https://www.hdb.gov.sg/cs/infoweb/residential/buying-a-flat/new/schemes-and-grants/cpf-housing-grants-for-ecs';
  switch (fieldValues.housingType) {
    case 'Resale':
      return resale;
    case 'EC':
      return ec;
    default:
      return { Resale: resale, EC: ec };
  }
};

export const getProximityGrantWebsite = () =>
  'https://www.hdb.gov.sg/cs/infoweb/residential/buying-a-flat/resale/financing/cpf-housing-grants/living-with-near-parents-or-child';

export const getSingleEHGGrantWebsite = (
  fieldValues: Record<string, string>
) => {
  const conditionsAndWebsites = [
    {
      link: 'https://www.hdb.gov.sg/cs/infoweb/residential/buying-a-flat/resale/financing/cpf-housing-grants/firsttimer-and-secondtimer-couple-applicants',
      label: 'Resale and one partner is a first time buyer',
      conditions: [
        ['housingType', 'Resale'],
        ['coupleFirstTimer', 'true/false'],
      ],
    },
    {
      link: 'https://www.hdb.gov.sg/cs/infoweb/residential/buying-a-flat/resale/financing/cpf-housing-grants/noncitizen-spouse-scheme',
      label: 'Resale and SC/F couple',
      conditions: [
        ['housingType', 'Resale'],
        ['coupleNationality', 'SC/F'],
      ],
    },
    {
      link: 'https://www.hdb.gov.sg/cs/infoweb/residential/buying-a-flat/resale/financing/cpf-housing-grants/single-singapore-citizen-scheme',
      label: 'Resale and single',
      conditions: [
        ['housingType', 'Resale'],
        ['maritalStatus ', 'single'],
      ],
    },
    {
      link: 'https://www.hdb.gov.sg/cs/infoweb/residential/buying-a-flat/new/schemes-and-grants/cpf-housing-grants-for-hdb-flats/firsttimer-and-secondtimer-couple-applicants',
      label: 'BTO and one partner is a first time buyer',
      conditions: [
        ['housingType', 'BTO'],
        ['coupleFirstTimer', 'true/false'],
      ],
    },
    {
      link: 'https://www.hdb.gov.sg/cs/infoweb/residential/buying-a-flat/new/schemes-and-grants/cpf-housing-grants-for-hdb-flats/noncitizen-spouse-scheme',
      label: 'BTO and SC/F couple',
      conditions: [
        ['housingType', 'BTO'],
        ['coupleNationality', 'SC/F'],
      ],
    },
    {
      link: 'https://www.hdb.gov.sg/cs/infoweb/residential/buying-a-flat/new/schemes-and-grants/cpf-housing-grants-for-hdb-flats/single-singapore-citizen-scheme',
      label: 'BTO and single',
      conditions: [
        ['housingType', 'BTO'],
        ['maritalStatus', 'single'],
      ],
    },
  ];

  return getLabelLinks(fieldValues, conditionsAndWebsites);
};

export const getSingleGrantWebsite = (fieldValues: Record<string, string>) => {
  const conditionsAndWebsites = [
    {
      link: 'https://www.hdb.gov.sg/cs/infoweb/residential/buying-a-flat/resale/financing/cpf-housing-grants/single-singapore-citizen-scheme',
      label: 'Single',
      conditions: [['maritalStatus', 'single']],
    },
    {
      link: 'https://www.hdb.gov.sg/cs/infoweb/residential/buying-a-flat/resale/financing/cpf-housing-grants/noncitizen-spouse-scheme',
      label: 'Single',
      conditions: [
        ['maritalStatus', 'couple'],
        ['coupleNationality', 'SC/F'],
      ],
    },
  ];
  return getLabelLinks(fieldValues, conditionsAndWebsites);
};

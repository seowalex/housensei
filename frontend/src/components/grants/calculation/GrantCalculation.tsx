/* eslint-disable no-param-reassign */
/* eslint-disable import/prefer-default-export  */
import proximityGrantTree from '../../../utils/grant_json/proximityGrant.json';
import familyGrantTree from '../../../utils/grant_json/familyGrant.json';
import halfHousingGrantTree from '../../../utils/grant_json/halfHousingGrant.json';

type Tree =
  | {
      attribute: string;
      options: Record<string, Tree>;
    }
  | number;

const isWithinIncomeRange = (income: string | number, incomeRange: string) => {
  const parsedIncome = Number(income);
  const conditions = incomeRange.split(' && ');
  return conditions.every((condition) => {
    const value = Number(condition.split(' ')[1]);
    if (condition.substring(0, 2) === '<=') {
      return parsedIncome <= value;
    }
    if (condition.substring(0, 1) === '>') {
      return parsedIncome > value;
    }
    console.log('not a valid range!');
    return false;
  });
};

const recurseTree = (
  fieldValues: Record<string, string | number>,
  tree: Tree,
  grantValues: {
    min: number | null;
    max: number | null;
  }
) => {
  if (typeof tree === 'number') {
    const minGrant = grantValues.min;
    const maxGrant = grantValues.max;
    if (!minGrant || tree < minGrant) {
      grantValues.min = tree;
    }
    if (!maxGrant || tree > maxGrant) {
      grantValues.max = tree;
    }
  } else {
    const { attribute } = tree;
    const subTrees = tree.options;
    const fieldValue = fieldValues[attribute]; // grab from form
    const chosenSubTree = subTrees[fieldValue];
    if (!fieldValue) {
      // user indicated unsure -> recurse down all subtrees
      Object.values(subTrees).forEach((subTree) => {
        recurseTree(fieldValues, subTree, grantValues);
      });
    } else if (attribute === 'monthlyIncome') {
      // monthlyIncome is hardcoded
      Object.keys(subTrees).forEach((incomeRange) => {
        if (isWithinIncomeRange(fieldValue, incomeRange)) {
          recurseTree(fieldValues, subTrees[incomeRange], grantValues);
        }
      });
    } else if (!chosenSubTree) {
      // no option in subtree -> min value is 0
      grantValues.min = 0;
      grantValues.max = grantValues.max ?? 0;
    } else {
      recurseTree(fieldValues, chosenSubTree, grantValues);
    }
  }
};

export const getFamilyGrant = (fieldValues: Record<string, any>) => {
  const grantValues = {
    min: null,
    max: null,
  };
  recurseTree(fieldValues, familyGrantTree, grantValues);
  return grantValues;
};

export const getProximityGrant = (fieldValues: Record<string, any>) => {
  const grantValues = {
    min: null,
    max: null,
  };
  recurseTree(fieldValues, proximityGrantTree, grantValues);
  return grantValues;
};

export const getHalfHousingGrant = (fieldValues: Record<string, any>) => {
  const grantValues = {
    min: null,
    max: null,
  };
  recurseTree(fieldValues, halfHousingGrantTree, grantValues);
  return grantValues;
};

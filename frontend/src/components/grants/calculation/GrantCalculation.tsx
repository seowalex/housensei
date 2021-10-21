/* eslint-disable no-param-reassign */
import ehgTree from '../../../utils/grant_json/EHG.json';
import ehgIncome from '../../../utils/grant_json/EHGIncome.json';
import familyGrantTree from '../../../utils/grant_json/familyGrant.json';
import halfHousingGrantTree from '../../../utils/grant_json/halfHousingGrant.json';
import proximityGrantTree from '../../../utils/grant_json/proximityGrant.json';
import singleEhgTree from '../../../utils/grant_json/singleEHG.json';
import singleEhgIncome from '../../../utils/grant_json/singleEHGIncome.json';
import singleGrantTree from '../../../utils/grant_json/singleGrant.json';
import {
  recurseBooleanTree,
  getEHGGrantValue,
  recurseTree,
} from './GrantTreeRecursion';

export type GrantRange = {
  min: number;
  max: number;
};

export const getEHGGrant = (fieldValues: Record<string, any>) => {
  const certainty = {
    true: 0,
    false: 0,
  };
  recurseBooleanTree(fieldValues, ehgTree, certainty);

  const grantValue = getEHGGrantValue(fieldValues.monthlyIncome, ehgIncome);

  if (certainty.true === 0) {
    return { min: 0, max: 0 };
  }
  if (certainty.false > 0) {
    return { min: 0, max: grantValue };
  }
  return { min: grantValue, max: grantValue };
};

export const getFamilyGrant = (fieldValues: Record<string, any>) => {
  const grantValues = {
    min: null,
    max: null,
  };
  recurseTree(fieldValues, familyGrantTree, grantValues);
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

export const getProximityGrant = (fieldValues: Record<string, any>) => {
  const grantValues = {
    min: null,
    max: null,
  };
  recurseTree(fieldValues, proximityGrantTree, grantValues);
  return grantValues;
};

export const getSingleEHGGrant = (fieldValues: Record<string, any>) => {
  const certainty = {
    true: 0,
    false: 0,
  };
  recurseBooleanTree(fieldValues, singleEhgTree, certainty);

  const grantValue = getEHGGrantValue(
    fieldValues.monthlyIncome,
    singleEhgIncome
  );

  if (certainty.true === 0) {
    return { min: 0, max: 0 };
  }
  if (certainty.false > 0) {
    return { min: 0, max: grantValue };
  }
  return { min: grantValue, max: grantValue };
};

export const getSingleGrant = (fieldValues: Record<string, any>) => {
  const grantValues = {
    min: null,
    max: null,
  };
  recurseTree(fieldValues, singleGrantTree, grantValues);
  return grantValues;
};

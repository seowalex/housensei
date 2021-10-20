/* eslint-disable no-param-reassign */
/* eslint-disable import/prefer-default-export  */
import proximityGrantTree from '../../../utils/grant_json/proximityGrant.json';

type Tree =
  | {
      attribute: string;
      options: Record<string, Tree>;
    }
  | number;

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
    } else if (!chosenSubTree) {
      // no option in subtree -> min value is 0
      grantValues.min = 0;
      grantValues.max = grantValues.max ?? 0;
    } else {
      recurseTree(fieldValues, chosenSubTree, grantValues);
    }
  }
};

export const getProximityGrant = (fieldValues: Record<string, any>) => {
  const grantValues = {
    min: null,
    max: null,
  };
  recurseTree(fieldValues, proximityGrantTree, grantValues);
  return grantValues;
};

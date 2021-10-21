/* eslint-disable no-param-reassign */

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

export const recurseTree = (
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

type BooleanTree =
  | {
      attribute: string;
      options: Record<string, BooleanTree>;
    }
  | boolean;

export const recurseBooleanTree = (
  fieldValues: Record<string, string | number>,
  tree: BooleanTree,
  certainty: {
    true: number;
    false: number;
  }
) => {
  if (typeof tree === 'boolean') {
    if (tree) {
      certainty.true += 1;
    } else {
      certainty.false += 1;
    }
  } else {
    const { attribute } = tree;
    const subTrees = tree.options;
    const fieldValue = fieldValues[attribute]; // grab from form
    const chosenSubTree = subTrees[fieldValue];
    if (!fieldValue) {
      // user indicated unsure -> recurse down all subtrees
      Object.values(subTrees).forEach((subTree) => {
        recurseBooleanTree(fieldValues, subTree, certainty);
      });
    } else if (!chosenSubTree) {
      // no option in subtree -> might not get
      certainty.false += 1;
    } else {
      recurseBooleanTree(fieldValues, chosenSubTree, certainty);
    }
  }
};

export const getEHGGrantValue = (
  monthlyIncome: string,
  table: Array<{ income: number; amount: number }>
) => {
  const parsedMonthlyIncome = Number(monthlyIncome);
  return (
    table
      .slice(0, -1)
      .find(
        (row, idx) =>
          parsedMonthlyIncome === 0 ||
          (parsedMonthlyIncome > row.income &&
            parsedMonthlyIncome <= table[idx + 1].income)
      )?.amount ?? 0
  );
};

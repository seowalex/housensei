/* eslint-disable import/prefer-default-export */
import { MatchSorterOptions } from 'match-sorter';

export const townSorter =
  (
    groupBy?: (option: string) => string
  ): MatchSorterOptions<string>['sorter'] =>
  (rankedItems) => {
    if (!groupBy) {
      return rankedItems;
    }

    const itemGroups = rankedItems
      .map((rankedItem) => groupBy(rankedItem.item))
      .filter((value, index, self) => self.indexOf(value) === index);

    return [...rankedItems].sort(
      (a, b) =>
        itemGroups.indexOf(groupBy(a.item)) -
          itemGroups.indexOf(groupBy(b.item)) ||
        rankedItems.indexOf(a) - rankedItems.indexOf(b)
    );
  };

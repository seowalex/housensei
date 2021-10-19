import * as XLSX from 'xlsx';
import { getRepository } from 'typeorm';
import config from '../config/index';
import classValidate from '../utils/validate';
import BTO from '../models/bto';
import { FlatType, Town } from '../utils/model';

const headerRows = 22; // ignore rows above row 22
const footerRows = 20; // ignore last 20 rows

const delimitersRegex = /to|\/|-/;

const handleMergeCells = (
  ws: XLSX.WorkSheet,
  data: Array<Array<string | number>>
) => {
  const newData = data;
  // write over merged cells with same value, otherwise only topleft cell of merged cell will contain value
  (ws['!merges'] ?? []).forEach((mergeRange) => {
    const p1 = mergeRange.e;
    const p2 = mergeRange.s;
    const ptWithData = p1.c < p2.c || p1.r < p2.r ? p1 : p2;
    const ptWithoutData = p1.c < p2.c || p1.r < p2.r ? p2 : p1;

    if (ptWithData.c === ptWithoutData.c) {
      for (let i = ptWithData.r + 1; i <= ptWithoutData.r; i += 1) {
        newData[i][ptWithData.c] = data[ptWithData.r][ptWithData.c];
      }
    } else {
      for (let i = ptWithData.c + 1; i <= ptWithoutData.c; i += 1) {
        newData[ptWithData.r][i] = data[ptWithData.r][ptWithData.c];
      }
    }
  });
  return newData;
};

const combineBTOs = (
  addToBTO: Omit<BTO, 'id'>,
  newBTO: Partial<{ [K in keyof BTO]: BTO[K] | null }>
) => {
  const {
    units,
    minFloorArea,
    maxFloorArea,
    minInternalFloorArea,
    maxInternalFloorArea,
    minPrice,
    maxPrice,
  } = newBTO;
  const lastBtoAdded = addToBTO;
  if (units) {
    if (lastBtoAdded.units) {
      lastBtoAdded.units += units;
    } else {
      lastBtoAdded.units = units;
    }
  }
  if (
    minFloorArea &&
    (!lastBtoAdded.minFloorArea || lastBtoAdded.minFloorArea > minFloorArea)
  ) {
    lastBtoAdded.minFloorArea = minFloorArea;
  }
  if (
    maxFloorArea &&
    (!lastBtoAdded.maxFloorArea || lastBtoAdded.maxFloorArea < maxFloorArea)
  ) {
    lastBtoAdded.maxFloorArea = maxFloorArea;
  }
  if (
    minInternalFloorArea &&
    (!lastBtoAdded.minInternalFloorArea ||
      lastBtoAdded.minInternalFloorArea > minInternalFloorArea)
  ) {
    lastBtoAdded.minInternalFloorArea = minInternalFloorArea;
  }
  if (
    maxInternalFloorArea &&
    (!lastBtoAdded.maxInternalFloorArea ||
      lastBtoAdded.maxInternalFloorArea < maxInternalFloorArea)
  ) {
    lastBtoAdded.maxInternalFloorArea = maxInternalFloorArea;
  }
  if (
    minPrice &&
    (!lastBtoAdded.minPrice || lastBtoAdded.minPrice > minPrice)
  ) {
    lastBtoAdded.minPrice = minPrice;
  }
  if (
    maxPrice &&
    (!lastBtoAdded.maxPrice || lastBtoAdded.maxPrice < maxPrice)
  ) {
    lastBtoAdded.maxPrice = maxPrice;
  }
  return addToBTO;
};

const seedBTOs = async () => {
  const file = 'HDB-BTO-Prices-List.xls';
  const workbook = XLSX.readFile(config.dataFilePath + file, {
    cellDates: true,
    cellNF: false,
    cellText: false,
  });
  const sheets = workbook.SheetNames;

  /* Convert array of arrays */
  const ws = workbook.Sheets[sheets[0]];
  let data = XLSX.utils.sheet_to_json(ws, {
    header: 1,
    defval: '',
  }) as Array<Array<string | number>>;

  data = handleMergeCells(ws, data);

  // indexes
  const TOWN = 1;
  const NAME = 2;
  const LAUNCH_DATE = 3;
  const FLAT_TYPE = 4;
  const FLOOR_AREA = 5;
  const INTERNAL_FLOOR_AREA = 6;
  const UNITS = 7;
  const PRICE = 8;

  const FLAT_TYPE_TO_IDX = {
    [FlatType.ROOM_2]: [13, 15],
    [FlatType.ROOM_3]: [17],
    [FlatType.ROOM_4]: [19],
    [FlatType.ROOM_5]: [21],
    [FlatType.GEN_3]: [23],
    [FlatType.STUDIO]: [9, 11],
  };

  const parseTown = (str: string | number) => {
    let town = str as Town;

    if ((town as any) === 'Kallang-Whampoa') {
      // it could be kallang-whampoa or kallang/whampoa - this is a hack
      town = Town.KAL;
    }

    if ((town as any) === 'Central') {
      // Central refers to Central Area
      town = Town.CEN;
    }

    if ((town as any) === 'Bidadari') {
      // Bidadari is actually in Toa Payoh
      town = Town.TAP;
    }

    if (!Object.values(Town).includes(town)) {
      return null;
    }

    return town;
  };

  // returns min and max as an array
  const parseFloorArea = (
    floorArea: string | number
  ): [number, number] | null => {
    if (!floorArea) {
      return null;
    }
    if (delimitersRegex.test(floorArea.toString())) {
      const minAndMax = floorArea
        .toString()
        .split(delimitersRegex)
        .map((str) => str.trim());
      // if (minAndMax.some((str) => Number.isNaN(str))) {
      //   console.log(floorArea);
      // }
      // TODO (116, 113) only ParkEdge @ Bidadari swaps min and max placing
      const minFloorArea = Number(minAndMax[0]);
      const maxFloorArea = Number(minAndMax[1]);
      return [minFloorArea, maxFloorArea];
    }
    if (!Number.isNaN(floorArea)) {
      return [Number(floorArea), Number(floorArea)];
    }
    // console.log('ooooo');
    // console.log(floorArea);
    return null;
  };

  const parsePrice = (priceRange: string | number) => {
    if (!priceRange) {
      return null;
    }
    if (delimitersRegex.test(priceRange.toString())) {
      const minAndMax = priceRange
        .toString()
        .replace(/[&#,+()$~%.'":*?<>{}]/g, '')
        .split(delimitersRegex)
        .map((str) => str.trim());

      // if (minAndMax.some((str) => Number.isNaN(str))) {
      //   console.log(priceRange);
      // }
      const minPrice = Number(minAndMax[0]);
      const maxPrice = Number(minAndMax[1]);
      return [minPrice, maxPrice];
    }
    // console.log('priceee');
    // console.log(priceRange);
    return null;
  };

  const btos: Array<Omit<BTO, 'id'>> = []; // what we are gonna add into the database in the end

  const interestedRows = data.slice(headerRows, -footerRows);
  interestedRows.forEach((row, rowIdx) => {
    let town = parseTown(row[TOWN]);

    let name = row[NAME] as string;

    let launchDate = new Date(row[LAUNCH_DATE]);

    // some rows at the bottom of the excel are not merged cells :(
    if ((!town || !name || !launchDate) && row[FLAT_TYPE]) {
      let currRowIdx = rowIdx - 1;
      while (!town && rowIdx - currRowIdx < 8) {
        const currRow = interestedRows[currRowIdx];
        town = parseTown(currRow[TOWN]);
        name = currRow[NAME] as string;
        launchDate = new Date(currRow[LAUNCH_DATE]);
        currRowIdx -= 1;
      }
    }

    if (!town || !name || !launchDate) {
      return;
    }

    // TODO 2-room + 4-room -> only the case for Skyterrace@Dawson
    const flatType = Object.values(FlatType).find((possibleflatType) =>
      row[FLAT_TYPE].toString().toLowerCase().includes(possibleflatType)
    );
    if (!flatType) {
      // console.log(name);
      return;
    }

    const floorArea = parseFloorArea(row[FLOOR_AREA]);
    const minFloorArea = floorArea ? floorArea[0] : null;
    const maxFloorArea = floorArea ? floorArea[1] : null;

    const internalFloorArea = parseFloorArea(row[INTERNAL_FLOOR_AREA]);
    const minInternalFloorArea = internalFloorArea
      ? internalFloorArea[0]
      : null;
    const maxInternalFloorArea = internalFloorArea
      ? internalFloorArea[1]
      : null;

    const units = Number.isNaN(row[UNITS]) ? null : Number(row[UNITS]);

    // slightly complex cos some prices are found in one of normal row / transpose or both
    // find normal row, otherwise find in relevant rows of transpose
    const priceRange = parsePrice(row[PRICE]);
    let minPrice: number | null = priceRange ? priceRange[0] : null;
    let maxPrice: number | null = priceRange ? priceRange[1] : null;
    if (!priceRange) {
      // rows to look at
      const firstRowOfBTO = data.filter((btoRow) => btoRow[NAME] === name)[0];
      const btoRows = [row, firstRowOfBTO];

      btoRows.forEach((btoRow) =>
        FLAT_TYPE_TO_IDX[flatType].forEach((idx) => {
          minPrice =
            btoRow[idx] && (!minPrice || btoRow[idx] < minPrice)
              ? Number(btoRow[idx])
              : minPrice;
          maxPrice =
            btoRow[idx + 1] && (!maxPrice || btoRow[idx + 1] > maxPrice)
              ? Number(btoRow[idx + 1])
              : maxPrice;
        })
      );
    }

    if (!minPrice || !maxPrice) {
      // console.log(name);
      // console.log(FLAT_TYPE_TO_IDX[flatType]);
      return;
    }

    const newBTO = {
      town,
      name,
      launchDate,
      flatType,
      units,
      minFloorArea,
      maxFloorArea,
      minInternalFloorArea,
      maxInternalFloorArea,
      minPrice,
      maxPrice,
    };

    // this excel has studio aparment type a and b, 2 room type a and b
    // thus, this part combines both room types into 1, if previous exists
    const lastBtoAdded = btos[btos.length - 1];
    const isCombine =
      lastBtoAdded?.name === name && lastBtoAdded?.flatType === flatType;

    if (isCombine) {
      btos[btos.length - 1] = combineBTOs(lastBtoAdded, {
        units,
        minFloorArea,
        maxFloorArea,
        minInternalFloorArea,
        maxInternalFloorArea,
        minPrice,
        maxPrice,
      });
    } else {
      btos.push(Object.assign(new BTO(), newBTO));
    }
  });

  // remove flats that do not pass validation
  await btos.forEach(async (bto: any, idx) => {
    await classValidate(bto, true).catch(() => {
      // console.log(bto);
      // console.log(err.errors);
      btos.splice(idx, 1);
    });
  });

  await getRepository(BTO).clear();
  await getRepository(BTO).save(btos);
  // .catch((err) => console.log(err));

  // eslint-disable-next-line no-console
  console.info('Seeded bto table');
};

export default seedBTOs;

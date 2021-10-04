import * as XLSX from 'xlsx';
import { getRepository } from 'typeorm';
import classValidate from '../utils/validate';
import BTO from '../models/bto';
import { FlatType, Town } from '../utils/model';

const headerRows = 22;
const footerRows = 20;

const delimiters = ['-', 'to', '/'];
const delimitersRegex = /to|\/|-/;

const seedBTOs = async () => {
  const file = process.argv[2];
  const workbook = XLSX.readFile(file, {
    cellDates: true,
    cellNF: false,
    cellText: false,
  });
  const sheets = workbook.SheetNames;

  /* Convert array of arrays */
  const ws = workbook.Sheets[sheets[0]];
  const data = XLSX.utils.sheet_to_json(ws, {
    header: 1,
    defval: '',
  }) as Array<Array<string | number>>;

  // write over merged cells with same value, otherwise only topleft cell of merged cell will contain value
  ws['!merges'] = ws['!merges'] ? ws['!merges'] : [];
  ws['!merges'].forEach((mergeRange) => {
    const p1 = mergeRange.e;
    const p2 = mergeRange.s;
    const ptWithData = p1.c < p2.c || p1.r < p2.r ? p1 : p2;
    const ptWithoutData = p1.c < p2.c || p1.r < p2.r ? p2 : p1;

    if (ptWithData.c === ptWithoutData.c) {
      for (let i = ptWithData.r + 1; i <= ptWithoutData.r; i += 1) {
        data[i][ptWithData.c] = data[ptWithData.r][ptWithData.c];
      }
    } else {
      for (let i = ptWithData.c + 1; i <= ptWithoutData.c; i += 1) {
        data[ptWithData.r][i] = data[ptWithData.r][ptWithData.c];
      }
    }
  });

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

  // returns min and max as an array
  const parseFloorArea = (
    floorArea: string | number
  ): [number, number] | null => {
    if (!floorArea) {
      return null;
    }
    if (
      delimiters.some((delimiter) => floorArea.toString().includes(delimiter))
    ) {
      const minAndMax = floorArea
        .toString()
        .split(delimitersRegex)
        .map((str) => str.trim());
      if (minAndMax.some((str) => Number.isNaN(str))) {
        console.log(floorArea);
      }
      const minFloorArea = Number(minAndMax[0]);
      const maxFloorArea = Number(minAndMax[1]);
      return [minFloorArea, maxFloorArea];
    }
    if (!Number.isNaN(floorArea)) {
      return [Number(floorArea), Number(floorArea)];
    }
    console.log('ooooo');
    console.log(floorArea);
    return null;
  };

  const parsePrice = (priceRange: string | number) => {
    if (!priceRange) {
      return null;
    }
    if (priceRange.toString().includes('-')) {
      const minAndMax = priceRange
        .toString()
        .replace(/[&#,+()$~%.'":*?<>{}]/g, '')
        .split(delimitersRegex)
        .map((str) => str.trim());

      if (minAndMax.some((str) => Number.isNaN(str))) {
        console.log(priceRange);
      }
      const minPrice = Number(minAndMax[0]);
      const maxPrice = Number(minAndMax[1]);
      return [minPrice, maxPrice];
    }
    console.log('priceee');
    console.log(priceRange);
    return null;
  };

  const btos: Array<Omit<BTO, 'id'>> = [];

  const interestedRows = data.slice(headerRows, -footerRows);
  interestedRows.forEach((row) => {
    let town = row[TOWN] as Town;
    if ((town as any) === 'Kallang/Whampoa') {
      town = Town.KAL;
    }
    if (!Object.values(Town).includes(town)) {
      console.log(town);
      return;
    }

    const name = row[NAME] as string;
    if (!name) {
      return;
    }

    // const launchDateMoment = moment(row[LAUNCH_DATE], [
    //   'MMMM YYYY',
    //   'DD MMMM YYYY',
    // ]);

    // if (!launchDateMoment.isValid()) {
    //   console.log(row[LAUNCH_DATE]);
    //   console.log(row);
    // }

    // const launchDate = launchDateMoment.toDate();
    const launchDate = new Date(row[LAUNCH_DATE]);

    // TODO 2-room + 4-room
    const flatType = Object.values(FlatType).find((possibleflatType) =>
      row[FLAT_TYPE].toString().toLowerCase().includes(possibleflatType)
    );
    if (!flatType) {
      console.log(name);
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

    const priceRange = parsePrice(row[PRICE]);
    let minPrice: number | null = priceRange ? priceRange[0] : null;
    let maxPrice: number | null = priceRange ? priceRange[1] : null;
    if (!priceRange) {
      // row to look at
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
      console.log(name);
      console.log(FLAT_TYPE_TO_IDX[flatType]);
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

    const lastBtoAdded = btos[btos.length - 1];
    const isCombine =
      lastBtoAdded?.name === name && lastBtoAdded?.flatType === flatType;

    if (isCombine) {
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
    } else {
      btos.push(Object.assign(new BTO(), newBTO));
    }

    // : Partial<BTO>

    // if (minFloorArea && maxFloorArea) {
    //   newBTO.minFloorArea = minFloorArea;
    //   newBTO.maxFloorArea = maxFloorArea;
    // }

    // if (minInternalFloorArea && maxInternalFloorArea) {
    //   newBTO.minInternalFloorArea = minInternalFloorArea;
    //   newBTO.maxInternalFloorArea = maxInternalFloorArea;
    // }

    // getRepository(BTO)
    //   .save(Object.assign(new BTO(), newBTO))
    //   .catch(() => console.log(newBTO));
    // btos.push(newBTO as Omit<BTO, 'id'>);

    // });
  });

  await btos.forEach(async (bto: any, idx) => {
    await classValidate(bto, true).catch((err) => {
      console.log(bto);
      console.log(err.errors);
      btos.splice(idx, 1);
    });
    // await getRepository(BTO)
    //   .save(bto)
    //   .catch(() => console.log(bto));
    // if (
    //   bto.minFloorArea === '' ||
    //   bto.minInternalFloorArea === '' ||
    //   bto.units === '' ||
    //   bto.minPrice === ''
    // ) {
    //   console.log(bto);
    // }
    //   if (Number.isNaN(value)) {
    //     console.log(bto);
    //   }
  });

  await getRepository(BTO)
    .save(btos)
    .catch((err) => console.log(err));
};

seedBTOs();

export default seedBTOs;

import * as XLSX from 'xlsx';
import { getRepository } from 'typeorm';
import fs from 'fs';
import Resale from '../models/resale';
import { FlatType, Town } from '../utils/model';
import getCoordinates from './get-coordinates';
import config from '../config/index';

const filePaths = [
  'resale-flat-prices-based-on-approval-date-1990-1999.xlsx',
  'resale-flat-prices-based-on-approval-date-2000-feb-2012.xlsx',
  'resale-flat-prices-based-on-registration-date-from-mar-2012-to-dec-2014.xlsx',
  'resale-flat-prices-based-on-registration-date-from-jan-2015-to-dec-2016.xlsx',
  'resale-flat-prices-based-on-registration-date-from-jan-2017-onwards.xlsx',
];

const coordinatesFilePath = 'coordinates.json';

const capitalizeEachWord = (text: string) => {
  let newText = '';
  let toCapitalize = true;

  for (let i = 0; i < text.length; i += 1) {
    if (text.charAt(i) === ' ' || text.charAt(i) === '/') {
      toCapitalize = true;
      newText += text.charAt(i);
    } else if (toCapitalize) {
      newText += text.charAt(i).toUpperCase();
      toCapitalize = !toCapitalize;
    } else {
      newText += text.charAt(i).toLowerCase();
    }
  }

  return newText;
};

const parseLocation = (text: string) => {
  const formatted = capitalizeEachWord(text);

  return formatted;
};

const formatRoomType = (type: string) => {
  if (type.toLowerCase() === 'executive') {
    return 'studio';
  }

  if (
    type.toLowerCase() === 'multi-generation' ||
    type.toLowerCase() === 'multi generation'
  ) {
    return 'gen';
  }

  return type.toLowerCase().replace(' ', '-');
};

// const parseRemainingLease = (remainingLease: string): number => {
//   let remainingLeaseYear = 0;
//   let remainingLeaseMonth = 0;

//   remainingLeaseYear = parseInt(remainingLease, 10);
//   if (Number.isNaN(remainingLeaseYear)) {
//     if (remainingLease.includes('years')) {
//       remainingLeaseYear = parseInt(
//         remainingLease.split('years')[0].trim(),
//         10
//       );
//     } else if (remainingLease.includes('year')) {
//       remainingLeaseYear = 1;
//     }

//     if (remainingLease.includes('months')) {
//       remainingLeaseMonth = parseInt(
//         remainingLease.split('months')[0].trim(),
//         10
//       );
//     } else if (remainingLease.includes('month')) {
//       remainingLeaseMonth = 1;
//     }
//   }

//   return remainingLeaseYear * 12 + remainingLeaseMonth;
// };

const parseStoreyRange = (range: string): number[] => {
  const storeyRangeSplit = range.split('TO');
  const minStorey = parseInt(storeyRangeSplit[0].trim(), 10);
  const maxStorey = parseInt(storeyRangeSplit[1].trim(), 10);
  return [minStorey, maxStorey];
};

async function seedResale() {
  await getRepository(Resale).clear();

  let totalEntries = 0;

  const BLOCK = 3;
  const STREET_NAME = 4;

  // all files
  const files = {};
  let allDataRows: Array<Array<string | number>> = [];
  for (let i = 0; i < filePaths.length; i += 1) {
    const filePath = filePaths[i];

    const workbook = XLSX.readFile(config.dataFilePath + filePath, {
      cellDates: true,
      cellNF: false,
      cellText: false,
    });
    const sheets = workbook.SheetNames;

    /* Convert array of arrays */
    const ws = workbook.Sheets[sheets[0]];
    const data = XLSX.utils
      .sheet_to_json(ws, {
        header: 1,
        defval: '',
      })
      .slice(1) as Array<Array<string | number>>;

    files[filePath] = data;
    allDataRows = allDataRows.concat(data);
  }

  let allCoordinates;

  if (fs.existsSync(config.dataFilePath + coordinatesFilePath)) {
    allCoordinates = JSON.parse(
      fs.readFileSync(config.dataFilePath + coordinatesFilePath, 'utf8')
    );
  } else {
    allCoordinates = await getCoordinates(
      allDataRows.map((row) => ({
        block: row[BLOCK] as string,
        streetName: capitalizeEachWord(row[STREET_NAME] as string),
      }))
    );
  }

  for (let i = 0; i < filePaths.length; i += 1) {
    const isOldFormat = i < 3;
    const filePath = filePaths[i];

    const dataRows = files[filePath];

    // indexes
    const MONTH = 0;
    const TOWN = 1;
    const FLAT_TYPE = 2;

    const STOREY_RANGE = 5;
    const FLOOR_AREA_SQM = 6;
    const FLAT_MODEL = 7;
    const LEASE_COMMENCE_DATE = 8;
    const RESALE_PRICE = isOldFormat ? 9 : 10;

    // Map to correct database format
    // eslint-disable-next-line no-await-in-loop
    // eslint-disable-next-line no-loop-func
    const allResale: Resale[] = dataRows.map((row) => {
      const resale = new Resale();
      resale.transactionDate = new Date(row[MONTH]);
      resale.town = parseLocation(row[TOWN] as string) as Town;
      resale.flatType = formatRoomType(row[FLAT_TYPE] as string) as FlatType;
      resale.flatModel = row[FLAT_MODEL] as string;
      resale.block = row[BLOCK] as string;
      resale.streetName = capitalizeEachWord(row[STREET_NAME] as string);
      resale.floorArea = Math.floor(row[FLOOR_AREA_SQM] as number);
      const [minStorey, maxStorey] = parseStoreyRange(
        row[STOREY_RANGE] as string
      );
      resale.minStorey = minStorey;
      resale.maxStorey = maxStorey;
      resale.leaseCommenceYear = new Date(row[LEASE_COMMENCE_DATE].toString());

      resale.resalePrice = Math.floor(row[RESALE_PRICE] as number);

      // add geom
      const coordinates = allCoordinates[resale.streetName][resale.block];
      if (coordinates) {
        resale.coordinates = coordinates;
      }

      return resale;
    });

    let seededResale = 0;
    // Insert by batches
    while (seededResale < allResale.length) {
      const resaleToSeed = allResale.slice(
        seededResale,
        Math.min(seededResale + 1000, allResale.length)
      );
      // eslint-disable-next-line no-await-in-loop
      await getRepository(Resale).save(resaleToSeed);
      seededResale += resaleToSeed.length;
    }

    // eslint-disable-next-line no-console
    console.log(`Seeded file ${i + 1}: ${dataRows.length} entries`);
    totalEntries += dataRows.length;
  }

  // eslint-disable-next-line no-console
  console.log(`Resale table seeded: ${totalEntries} entries`);
}

export default seedResale;

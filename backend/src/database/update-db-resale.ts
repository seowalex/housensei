/* eslint-disable camelcase */
import axios from 'axios';
import { getRepository } from 'typeorm';
import { FlatType, Town } from '../utils/model';
import ResaleFlat from '../models/resale';
import dbConnection from './connection';
import { ResaleRecord } from '../utils/resaleRecord';
import { ResaleResponse } from '../utils/resaleResponse';

const url = 'https://data.gov.sg/api/action/datastore_search';

const resourceIds = [
  'adbbddd3-30e2-445f-a123-29bee150a6fe',
  '8c00bf08-9124-479e-aeca-7cc411d884c4',
  '83b2fc37-ce8c-4df4-968b-370fd818138b',
  '1b702208-44bf-4829-b620-4615ee19b57c',
  'f1765b54-a209-4718-8d38-a39237f502b3',
];

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

  if (formatted === 'Central Area') {
    return 'Central';
  }

  if (formatted === 'Kallang/Whampoa') {
    return 'Kallang-Whampoa';
  }

  return formatted;
};

const formatRoomType = (type: string) => {
  if (type === 'EXECUTIVE') {
    return 'studio';
  }

  if (type === 'MULTI-GENERATION') {
    return 'gen';
  }

  return capitalizeEachWord(type).replace(' ', '-');
};

const parseRemainingLease = (
  remainingLease: string | undefined
): number | undefined => {
  if (remainingLease === undefined) {
    return undefined;
  }

  let remainingLeaseYear = 0;
  let remainingLeaseMonth = 0;

  remainingLeaseYear = parseInt(remainingLease, 10);
  if (Number.isNaN(remainingLeaseYear)) {
    if (remainingLease.includes('years')) {
      remainingLeaseYear = parseInt(
        remainingLease.split('years')[0].trim(),
        10
      );
    } else if (remainingLease.includes('year')) {
      remainingLeaseYear = 1;
    }
  }

  if (remainingLease.includes('months')) {
    remainingLeaseMonth = parseInt(
      remainingLease.split('months')[0].trim(),
      10
    );
  } else if (remainingLease.includes('month')) {
    remainingLeaseMonth = 1;
  }

  return remainingLeaseYear * 12 + remainingLeaseMonth;
};

function transformRecord(record: ResaleRecord): ResaleFlat {
  const storeyRangeSplit = record.storey_range.split('TO');
  const minStorey = parseInt(storeyRangeSplit[0].trim(), 10);
  const maxStorey = parseInt(storeyRangeSplit[1].trim(), 10);

  const remainingLease = parseRemainingLease(record.remaining_lease);

  const resale = new ResaleFlat();
  resale.transactionDate = new Date(record.month);
  resale.location = parseLocation(record.town) as Town;
  resale.flatType = formatRoomType(record.flat_type) as FlatType;
  resale.flatModel = record.flat_model;
  resale.block = record.block;
  resale.streetName = record.street_name;
  resale.floorArea = parseInt(record.floor_area_sqm, 10);
  resale.minStorey = minStorey;
  resale.maxStorey = maxStorey;
  resale.leaseCommenceYear = new Date(record.lease_commence_date);
  if (remainingLease !== undefined) {
    resale.remainingLease = remainingLease;
  }

  resale.resalePrice = parseInt(record.resale_price, 10);
  return resale;
}

// Pull new resale data through api
async function updateResale() {
  await dbConnection;

  // find a better way to update
  await getRepository(ResaleFlat).clear();

  for (let i = 0; i < resourceIds.length; i += 1) {
    let offset = 0;

    // eslint-disable-next-line no-await-in-loop
    const initialResponse = await axios.get<ResaleResponse>(url, {
      params: {
        resource_id: resourceIds[i],
        limit: 1,
      },
    });

    const { total } = initialResponse.data.result;

    // eslint-disable-next-line no-console
    console.log(`Total: ${total}`);

    const allFlats: ResaleFlat[] = [];

    try {
      while (offset < total) {
        // eslint-disable-next-line no-await-in-loop
        const response = await axios.get<ResaleResponse>(url, {
          params: {
            resource_id: resourceIds[i],
            offset,
          },
        });

        const { records } = response.data.result;

        const resaleFlats = records.map(transformRecord);
        allFlats.push(...resaleFlats);
        offset += records.length;
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }

    try {
      // eslint-disable-next-line no-await-in-loop
      await getRepository(ResaleFlat).save(allFlats);
      // eslint-disable-next-line no-console
      console.info(`Updated batch ${i + 1}`);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }

  // eslint-disable-next-line no-console
  console.info('Updated resale database table');
}

updateResale();

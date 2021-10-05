/* eslint-disable camelcase */
import axios from 'axios';
import { getRepository } from 'typeorm';
import { FlatType, Town } from '../utils/model';
import ResaleFlat from '../models/resale';
import dbConnection from './connection';
import { ResaleRecord } from './resaleRecord';
import { ResaleResponse } from './resaleResponse';

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

function transformRecord(record: ResaleRecord): ResaleFlat {
  const storeyRangeSplit = record.storey_range.split('TO');
  const minStorey = parseInt(storeyRangeSplit[0].trim(), 10);
  const maxStorey = parseInt(storeyRangeSplit[1].trim(), 10);

  let remainingLeaseYear = 0;
  let remainingLeaseMonth = 0;

  const remainingLease = record.remaining_lease;
  remainingLeaseYear = parseInt(remainingLease, 10);
  if (Number.isNaN(remainingLeaseYear)) {
    if (record.remaining_lease.includes('years')) {
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

  const resale = new ResaleFlat();
  resale.transactionDate = new Date(record.month);
  resale.location = capitalizeEachWord(record.town) as Town;
  resale.flatType = record.flat_type as FlatType;
  resale.flatModel = record.flat_model;
  resale.block = parseInt(record.block, 10);
  resale.streetName = record.street_name;
  resale.floorArea = parseInt(record.floor_area_sqm, 10);
  resale.minStorey = minStorey;
  resale.maxStorey = maxStorey;
  resale.leaseCommenceYear = new Date(record.lease_commence_date);
  resale.remainingLease = remainingLeaseYear * 12 + remainingLeaseMonth;
  resale.resalePrice = parseInt(record.resale_price, 10);
  return resale;
}

async function updateResale() {
  await dbConnection;

  try {
    const response = await axios.get<ResaleResponse>(url, {
      params: {
        resource_id: '1b702208-44bf-4829-b620-4615ee19b57c',
        limit: 5,
      },
    });

    const { records } = response.data.result;

    const resaleFlats = records.map(transformRecord);

    console.log(resaleFlats);

    // find a better way to update
    await getRepository(ResaleFlat).clear();

    await getRepository(ResaleFlat).save(resaleFlats);
    // eslint-disable-next-line no-console
    console.info('Updated resale database table');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
}

updateResale();

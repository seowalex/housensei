/* eslint-disable camelcase */
import axios from 'axios';
import { getRepository } from 'typeorm';
import { FlatType, Town } from '../utils/model';
import ResaleFlat from '../models/resale';
import dbConnection from './connection';
import { ResaleRecord } from './resaleRecord';
import { ResaleResponse } from './resaleResponse';

const url = 'https://data.gov.sg/api/action/datastore_search';

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
  resale.location = record.town as Town;
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

    await getRepository(ResaleFlat).save(resaleFlats);
    // eslint-disable-next-line no-console
    console.info('Updated resale database table');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
}

updateResale();

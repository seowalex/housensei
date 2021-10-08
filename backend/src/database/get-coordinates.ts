import axios from 'axios';
import _ from 'lodash';
import {
  cacheAdapterEnhancer,
  throttleAdapterEnhancer,
} from 'axios-extensions';
import fs from 'fs';
import Resale from '../models/resale';
import {
  CoordinatesResponse,
  COORDINATES_API,
} from '../utils/coordinatesResponse';

/// 1000 ms 250 req
type Address = Pick<Resale, 'block' | 'streetName'>;
const getCoordinates = async (addresses: Array<Address>) => {
  // enhance the original axios adapter with throttle and cache enhancer
  if (!axios.defaults.adapter) {
    throw new Error('no axois????');
  }
  const http = axios.create({
    adapter: throttleAdapterEnhancer(
      cacheAdapterEnhancer(axios.defaults.adapter),
      { threshold: 4 }
    ),
  });

  const result: Record<string, Record<string, [number, number] | null>> = {};

  // get unique addresses
  const addressesByStreetName = _.chain(addresses)
    .groupBy('streetName')
    .value();
  _.forEach(
    addressesByStreetName,
    (values: Array<Address>, streetName: string) => {
      const blocks = {};
      _.forEach(values, (value) => {
        blocks[value.block] = null;
      });
      result[streetName] = blocks;
    }
  );

  const uniqAddresses: Address[] = [];

  _.forEach(result, (values, streetName) => {
    _.forEach(values, (_, block) => {
      uniqAddresses.push({ streetName, block });
    });
  });

  // there are 9469 unqiue addresses -> should take around 40 mins

  console.log(uniqAddresses.length); // takes abt 40 seconds to reach here

  // uniqAddresses = uniqAddresses.slice(250, 350);

  await Promise.all(
    uniqAddresses.map(async (addr, idx) => {
      const response = await http.get<CoordinatesResponse>(COORDINATES_API, {
        params: {
          searchVal: `${addr.block} ${addr.streetName}`,
          returnGeom: 'Y',
          getAddrDetails: 'N',
          pageNum: 1,
        },
      });

      const firstResult = response.data.results[0];
      // console.log(firstResult);
      console.log(idx);
      if (firstResult) {
        result[addr.streetName][addr.block] = [
          parseFloat(firstResult.LATITUDE),
          parseFloat(firstResult.LONGITUDE),
        ];
      }
    })
  );

  const data = JSON.stringify(result, null, 4);

  // write JSON string to a file
  fs.writeFile('src/database/data/coordinates.json', data, (err) => {
    if (err) {
      throw err;
    }
    console.log('JSON data is saved.');
  });

  return result;
};

export default getCoordinates;

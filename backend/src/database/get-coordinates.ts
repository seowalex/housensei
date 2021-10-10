import axios from 'axios';
import _ from 'lodash';
import axiosThrottle from 'axios-request-throttle';
import fs from 'fs';
import Resale from '../models/resale';
import {
  CoordinatesResponse,
  COORDINATES_API,
} from '../utils/coordinatesResponse';

type Address = Pick<Resale, 'block' | 'streetName'>;
const getCoordinates = async (addresses: Array<Address>) => {
  axiosThrottle.use(axios, { requestsPerSecond: 250 });

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
    _.forEach(values, (_nullValue, block) => {
      uniqAddresses.push({ streetName, block });
    });
  });

  // takes abt 40 seconds to reach here

  await Promise.all(
    uniqAddresses.map(async (addr) => {
      const response = await axios.get<CoordinatesResponse>(COORDINATES_API, {
        params: {
          searchVal: `${addr.block} ${addr.streetName}`,
          returnGeom: 'Y',
          getAddrDetails: 'N',
          pageNum: 1,
        },
      });

      const firstResult = response.data.results[0];
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
  fs.writeFileSync('src/database/data/coordinates.json', data);

  return result;
};

export default getCoordinates;

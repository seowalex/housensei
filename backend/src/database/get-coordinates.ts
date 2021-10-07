import axios from 'axios';
import _ from 'lodash';
import Resale from '../models/resale';
import {
  CoordinatesResponse,
  COORDINATES_API,
} from '../utils/coordinatesResponse';

type Address = Pick<Resale, 'block' | 'streetName'>;
const getCoordinates = async (addresses: Array<Address>) => {
  const result: Record<string, Record<string, [number, number] | null>> = {};

  const testAddresses = addresses.slice(250, 300);

  // get unique addresses
  const addressesByStreetName = _.chain(testAddresses)
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

  return result;
};

export default getCoordinates;

import Koa from 'koa';
import _ from 'lodash';
import resaleService from '../services/resale';
import ResaleFlat from '../models/resale';
import { Town } from '../utils/model';

const getByIsland = async (ctx: Koa.Context): Promise<void> => {
  const resaleFlats = await resaleService.getResales(ctx.query); // { years: int }

  const townPrices = _.chain(resaleFlats)
    .groupBy('town')
    .map((value: Array<ResaleFlat>, key: Town) => ({
      town: key,
      resalePrice: _.meanBy(value, (resaleFlat) => resaleFlat.resalePrice),
    }));

  ctx.body = { data: townPrices };
};

const getByTown = async (ctx: Koa.Context): Promise<void> => {
  const resaleFlats = await resaleService.getResales(ctx.query); // { years: [int], town: Town }

  const blockPrices = _.chain(
    resaleFlats.map((resale) => ({
      address: `Blk ${resale.block} ${resale.streetName}`,
      resalePrice: resale.resalePrice,
    }))
  )
    .groupBy('address')
    .map((value: Array<ResaleFlat>, key: string) => ({
      address: key,
      resalePrice: _.meanBy(value, (resaleFlat) => resaleFlat.resalePrice),
    }));

  ctx.body = { data: blockPrices };
};

export default {
  getByIsland,
  getByTown,
};

import Koa from 'koa';
import _ from 'lodash';
import resaleService from '../services/resale';
import Resale from '../models/resale';
import { Town } from '../utils/model';

const getByIsland = async (ctx: Koa.Context): Promise<void> => {
  const resales = await resaleService.getResales(ctx.query); // { years: int }

  const townPrices = _.chain(resales)
    .groupBy('town')
    .map((value: Array<Resale>, key: Town) => ({
      town: key,
      resalePrice: _.meanBy(value, (resale) => resale.resalePrice),
    }));

  ctx.body = { data: townPrices };
};

const getByTown = async (ctx: Koa.Context): Promise<void> => {
  const resales = await resaleService.getResales(ctx.query); // { years: [int], town: Town }

  const blockPrices = _.chain(
    resales.map((resale) => ({
      address: `Blk ${resale.block} ${resale.streetName}`,
      resalePrice: resale.resalePrice,
    }))
  )
    .groupBy('address')
    .map((value: Array<Resale>, key: string) => ({
      address: key,
      resalePrice: _.meanBy(value, (resale) => resale.resalePrice),
    }));

  ctx.body = { data: blockPrices };
};

export default {
  getByIsland,
  getByTown,
};

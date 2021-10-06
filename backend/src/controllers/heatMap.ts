import Koa from 'koa';
import HttpStatus from 'http-status-codes';
import _ from 'lodash';
import resaleService from '../services/resale';
import ResaleFlat from '../models/resale';
import { Town } from '../utils/model';

const getByIsland = async (ctx: Koa.Context): Promise<void> => {
  const resales = await resaleService.getResales(ctx.query); // { years: Int }

  const townPrices = _.chain(resales)
    .groupBy('location')
    .map((value: Array<ResaleFlat>, key: Town) => ({
      town: key,
      price: _.mean(value.map((resale) => resale.resalePrice)),
    }));
  ctx.body = { data: townPrices };
};

const getByTown = async (ctx: Koa.Context): Promise<void> => {
  const resales = await resaleService.getResales(ctx.query); // { years: [int], town: Town }

  const blockPrices = _.chain(
    resales.map((resale) => ({
      address: `${resale.block} ${resale.streetName}`,
      price: resale.resalePrice,
    }))
  )
    .groupBy('address')
    .map((value, key) => ({
      address: key,
      price: _.mean(value.map((resale) => resale.price)),
    }));

  ctx.body = { data: blockPrices };
};

export default {
  getByIsland,
  getByTown,
};

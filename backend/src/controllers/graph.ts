import Koa from 'koa';
import _ from 'lodash';
import Resale from '../models/resale';
import graphServices from '../services/graph';
// import { QueryResale } from '../utils/resaleRecord';

const getResale = async (ctx: Koa.Context): Promise<void> => {
  // const { params } = ctx

  // const queryResale: QueryResale = {

  // }

  const resales = await graphServices.getResales(ctx.query);

  // console.log(resales);

  const averagePriceByDate = _.chain(resales)
    .groupBy('transactionDate')
    .map((value: Resale[], key: Date) => ({
      date: key,
      price: Math.round(_.meanBy(value, (resale) => resale.resalePrice)),
    }));

  ctx.body = {
    data: averagePriceByDate,
  };
};

const getBto = async (ctx: Koa.Context): Promise<void> => {
  ctx.body = {};
};

export default {
  getResale,
  getBto,
};

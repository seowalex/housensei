import Koa from 'koa';
import _ from 'lodash';
import BTO from '../models/bto';
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
  const btos = await graphServices.getBtos(ctx.query);

  console.log(btos);

  const averagePriceByProject = _.chain(btos)
    .groupBy('name')
    .map((value: BTO[], key: string) => ({
      name: key,
      price: Math.round(
        _.meanBy(value, (bto) => (bto.minPrice + bto.maxPrice) / 2)
      ),
      date: value[0].launchDate,
    }));
  ctx.body = {
    data: averagePriceByProject,
  };
};

export default {
  getResale,
  getBto,
};

import Koa from 'koa';
import _ from 'lodash';
import BTO from '../models/bto';
import Resale from '../models/resale';
import graphServices from '../services/graph';

const getResale = async (ctx: Koa.Context): Promise<void> => {
  const resales = await graphServices.getResales(ctx.query);

  const averagePriceByDate = _.chain(resales)
    .groupBy('transactionDate')
    .map((value: Resale[], key: Date) => ({
      date: key,
      price: Math.round(_.meanBy(value, (resale) => resale.resalePrice)),
    }));

  ctx.body = {
    data: {
      id: ctx.query.id,
      data: averagePriceByDate,
    },
  };
};

const getBto = async (ctx: Koa.Context): Promise<void> => {
  const btos = await graphServices.getBtos(ctx.query);
  const separator = '///';

  const averagePriceByProject = _.chain(btos)
    .groupBy((item) => `${item.name}${separator}${item.flatType}`)
    .map((value: BTO[], key: string) => ({
      name: key.split(separator)[0],
      flatType: key.split(separator)[1],
      price: Math.round(
        _.meanBy(value, (bto) => (bto.minPrice + bto.maxPrice) / 2)
      ),
      date: `${(value[0].launchDate as unknown as string).slice(0, -3)}-01`,
    }));
  ctx.body = {
    data: {
      id: ctx.query.id,
      data: averagePriceByProject,
    },
  };
};

export default {
  getResale,
  getBto,
};

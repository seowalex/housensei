import Koa from 'koa';
import resaleService from '../services/resale';
import { Town } from '../utils/model';

const getResalesByIsland = async (ctx: Koa.Context): Promise<void> => {
  const resales = await resaleService.getResalesByIsland({
    years: Array.isArray(ctx.query.years)
      ? ctx.query.years.map((year) => Number(year))
      : [Number(ctx.query.years)],
  });

  ctx.body = { data: resales };
};

const getResalesByTown = async (ctx: Koa.Context): Promise<void> => {
  const blockPrices = await resaleService.getResalesByTown({
    years: Array.isArray(ctx.query.years)
      ? ctx.query.years.map((year) => Number(year))
      : [Number(ctx.query.years)],
    town: ctx.query.town as Town,
  });

  ctx.body = { data: blockPrices };
};

export default {
  getResalesByIsland,
  getResalesByTown,
};

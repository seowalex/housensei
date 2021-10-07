import Koa from 'koa';
import resaleService from '../services/heatMap';
import { Town } from '../utils/model';

const parseYears = (queryYears: string | string[] | undefined) =>
  Array.isArray(queryYears)
    ? queryYears.map((year) => Number(year))
    : [Number(queryYears)];

const getResalesByIsland = async (ctx: Koa.Context): Promise<void> => {
  const resales = await resaleService.getResalesByIsland({
    years: parseYears(ctx.query.years),
  });

  ctx.body = { data: resales };
};

const getResalesByTown = async (ctx: Koa.Context): Promise<void> => {
  const resales = await resaleService.getResalesByTown({
    years: parseYears(ctx.query.years),
    town: ctx.query.town as Town,
  });

  ctx.body = { data: resales };
};

export default {
  getResalesByIsland,
  getResalesByTown,
};

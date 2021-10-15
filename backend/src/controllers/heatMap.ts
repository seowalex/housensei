import Koa from 'koa';
import resaleService from '../services/heatMap';
import { Town } from '../utils/model';

const parseYears = (queryYears: string | string[] | undefined) => {
  if (!queryYears) {
    return undefined;
  }
  return Array.isArray(queryYears)
    ? queryYears.map((year) => Number(year))
    : [Number(queryYears)];
};

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

  // agg each resale block by flatType
  const resalesAggByFlatType = resales.map((resale) => {
    const aggByRoom = {};
    const countByRoom = {};
    resale.details.forEach(
      // eslint-disable-next-line no-return-assign
      (detail) => {
        aggByRoom[detail.f1] = (aggByRoom[detail.f1] || 0) + detail.f2;
        countByRoom[detail.f1] = (countByRoom[detail.f1] || 0) + 1;
      }
    );
    Object.keys(aggByRoom).forEach((flatType) => {
      aggByRoom[flatType] /= countByRoom[flatType];
    });
    return {
      ...resale,
      details: aggByRoom,
    };
  });

  ctx.body = { data: resalesAggByFlatType };
};

export default {
  getResalesByIsland,
  getResalesByTown,
};

import Koa from 'koa';
import resaleService from '../services/heatMap';

const getResalesByIsland = async (ctx: Koa.Context): Promise<void> => {
  const resales = await resaleService.getResalesByIsland(ctx.query);

  ctx.body = { data: resales };
};

const getResalesByTown = async (ctx: Koa.Context): Promise<void> => {
  const resales = await resaleService.getResalesByTown(ctx.query);

  ctx.body = { data: resales };
};

export default {
  getResalesByIsland,
  getResalesByTown,
};

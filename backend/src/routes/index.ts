import Router from 'koa-router';
import graphRouter from './graph';
import heatMapRouter from './heatMap';

const router = new Router({ prefix: '/api' });

router.use('', graphRouter.routes());

router.use('/resale/heatmap', heatMapRouter.routes());

export default router;

import Router from 'koa-router';
import heatMapRouter from './heatMap';

const router = new Router({ prefix: '/api' });

router.use('/resale/heatmap', heatMapRouter.routes());

export default router;

import Router from 'koa-router';
import graphRouter from './graph';

const router = new Router({ prefix: '/api' });

router.use('', graphRouter.routes());

export default router;

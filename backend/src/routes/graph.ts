import Router from 'koa-router';
import graphController from '../controllers/graph';

const router: Router = new Router();

router.get('/resale/graph', graphController.getResale);

router.get('/bto/graph', graphController.getBto);

export default router;

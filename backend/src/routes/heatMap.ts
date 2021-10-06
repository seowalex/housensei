import Router from 'koa-router';
import heatMapController from '../controllers/heatMap';

const router: Router = new Router();

router.get('/island', heatMapController.getByIsland);

router.get('/town', heatMapController.getByTown);

export default router;

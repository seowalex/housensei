import Router from 'koa-router';
import heatMapController from '../controllers/heatMap';

const router: Router = new Router();

router.get('/island', heatMapController.getResalesByIsland);

router.get('/town', heatMapController.getResalesByTown);

export default router;

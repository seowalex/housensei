import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import serve from 'koa-static';
import send from 'koa-send';
import json from 'koa-json';
import logger from 'koa-logger';
import HttpStatus from 'http-status-codes';
import helmet from 'koa-helmet';
import Exception from './utils/exception';
import dbConnection from './database/connection';
import config from './config/index';
import router from './routes/index';

const app = new Koa();

app.use(serve('../frontend/dist'));

dbConnection.then(() => {
  // eslint-disable-next-line no-console
  console.info('db listening on port: ', config.dbPort);
});

app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

app.use(bodyParser());
app.use(json());

app.use(cors());

app.use(async (ctx: Koa.Context, next: () => Promise<any>) => {
  try {
    await next();
  } catch (error: any) {
    if (error instanceof Exception) {
      // model validator errors
      ctx.status = HttpStatus.BAD_REQUEST;
      ctx.body = error;
    } else {
      // ctx.throw errors
      ctx.status =
        error.statusCode || error.status || HttpStatus.INTERNAL_SERVER_ERROR;
      if (error.message) {
        ctx.body = { errors: [{ detail: [error.message] }] };
      }
    }
  }
});

app.use(router.routes()).use(router.allowedMethods());

app.use(async (ctx) => {
  await send(ctx, '/index.html', { root: '../frontend/dist' });
});

// Development logging
app.use(
  logger((str) => {
    // redirect koa logger to other output pipe
    // default is process.stdout(by console.log function)
    // eslint-disable-next-line no-console
    console.info(str);
  })
);

app.listen(config.port, () => {
  // eslint-disable-next-line no-console
  console.info('listening on port: ', config.port);
});

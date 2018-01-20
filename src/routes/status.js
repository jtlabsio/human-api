import Router from 'koa-router';
import countdown from 'countdown';

export default (app, models, self = {}) => {
	let
		router = new Router(),
		routeInit = new Date();

	app.log.trace('routes.status: registering routes for /v1/status');

	router.get('/v1/status', async (ctx) => {
		ctx.body = {
			headers : ctx.headers,
			memory : process.memoryUsage(),
			uptime : countdown(routeInit, new Date()).toString()
		};
	});

	app.use(router.routes());

	return self;
};

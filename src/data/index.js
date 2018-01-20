// import humans from './humans';

export default async (app, self = {}) => {
	if (!app) {
		throw new Error('application context is required for data');
	}

	app.log.info('data: initializing data layer');

	// self.humans = humans(app);

	return self;
};
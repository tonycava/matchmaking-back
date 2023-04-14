import type { CorsOptions } from 'cors';

const whitelist = [
	'http://localhost:[0-9]*',
	'https://aml.tonycava.dev',
	'http://matchmaking-front.info',
];

export const CORS_CONFIG: CorsOptions = {
	origin: (origin, callback) => {
		if (!origin || whitelist.some((url) => new RegExp(url).test(origin))) {
			if (process.env.NODE_ENV !== 'test') {
				console.debug('New request from: ' + origin + ': Success');
			}
			callback(null, true);
		} else {
			if (process.env.NODE_ENV !== 'test') console.debug('New request from: ' + origin + ': Fail');
			callback(new Error('Not allowed by CORS'));
		}
	},
	credentials: true,
};

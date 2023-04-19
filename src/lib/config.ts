import type { CorsOptions } from 'cors';

const whitelist = [
	'http://localhost:[0-9]*',
	'https://aml.tonycava.dev',
	'http://matchmaking-front.info'
];

export const CORS_CONFIG: CorsOptions = {
	origin: (origin, callback) => {
		if (!origin || whitelist.some((url) => new RegExp(url).test(origin))) {
			callback(null, true);
		} else {
			callback(new Error('Not allowed by CORS'));
		}
	},
	credentials: true
};

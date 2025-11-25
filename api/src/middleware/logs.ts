import morgan from 'morgan';
import logger from '../utils/logger';

const logsMiddleware = morgan(
	(tokens, req, res) => {
		return JSON.stringify({
			method: tokens.method?.(req, res),
			url: tokens.url?.(req, res),
			status: tokens.status?.(req, res),
			responseTime: `${tokens['response-time']?.(req, res)}ms`,
			userAgent: tokens['user-agent']?.(req, res)
		});
	},
	{
		stream: { write: message => logger.info(message.trim()) }
	}
);

export default logsMiddleware;

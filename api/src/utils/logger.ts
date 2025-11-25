import winston from 'winston';
const { combine, timestamp, json } = winston.format;

const logger = winston.createLogger({
	level: 'info',
	format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), json()),
	transports: [new winston.transports.Console()]
});

export default logger;

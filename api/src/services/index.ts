import type { RedisClient } from 'bun';

import EmailService from './email';
import NotificationsService from './notifications';
import AnalyticsService from './analytics';

export default class Services {
	public notifications: NotificationsService;
	public email: EmailService;
	public analytics: AnalyticsService;

	constructor(redis: RedisClient) {
		this.notifications = new NotificationsService(redis);
		this.email = new EmailService();
		this.analytics = new AnalyticsService();
	}
}

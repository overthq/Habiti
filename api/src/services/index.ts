import CacheService from './cache';
import EmailService from './email';
import NotificationsService from './notifications';
import AnalyticsService from './analytics';

export default class Services {
	public notifications: NotificationsService;
	public email: EmailService;
	public cache: CacheService;
	public analytics: AnalyticsService;

	constructor() {
		this.notifications = new NotificationsService();
		this.email = new EmailService();
		this.cache = new CacheService();
		this.analytics = new AnalyticsService();
	}
}

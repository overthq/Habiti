import CacheService from './cache';
import EmailService from './email';
import NotificationsService from './notifications';

export default class Services {
	public notifications: NotificationsService;
	public email: EmailService;
	public cache: CacheService;

	constructor() {
		this.notifications = new NotificationsService();
		this.email = new EmailService();
		this.cache = new CacheService();
	}
}

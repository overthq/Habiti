import EmailService from './email';
import NotificationsService from './notifications';

export default class Services {
	public notifications: NotificationsService;
	public email: EmailService;

	constructor() {
		this.notifications = new NotificationsService();
		this.email = new EmailService();
	}
}

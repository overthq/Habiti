import NotificationsService from './notifications';

export default class Services {
	public notifications: NotificationsService;

	constructor() {
		this.notifications = new NotificationsService();
	}
}

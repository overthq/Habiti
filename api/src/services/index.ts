// It's not lost on me that this is a *terrible* class name.

import NotificationsService from './notifications';

export default class Services {
	public notifications: NotificationsService;

	constructor() {
		this.notifications = new NotificationsService();
	}
}

export default class NotificationsService {
	private messages = [];

	queueMessage(message: any) {
		this.messages.push();
	}

	// Runs on a constant timer
	sendMessages() {}
}

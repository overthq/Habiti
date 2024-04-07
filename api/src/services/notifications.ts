import { Expo, ExpoPushMessage } from 'expo-server-sdk';

const expo = new Expo();

// Considerations:
// - It would be sad if we had to look up the user's pushToken every time
//   they made a request that needed it.

export default class NotificationsService {
	private messages = [];

	queueMessage(message: ExpoPushMessage) {
		this.messages.push(message);
	}

	// Runs on a constant timer
	async sendMessages() {
		const chunks = expo.chunkPushNotifications(this.messages);

		for (const chunk of chunks) {
			try {
				const tickets = await expo.sendPushNotificationsAsync(chunk);
			} catch (error) {
				console.log({ error });
			}
		}
	}
}

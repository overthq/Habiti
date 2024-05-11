import { Expo, ExpoPushMessage } from 'expo-server-sdk';

const expo = new Expo();

// Considerations:
// - It would be sad if we had to look up the user's pushToken every time
//   they made a request that needed it.
// We technically can return the user's pushToken from the data when we run
// any DB transactions, instead of having a separate lookup.

// Initial list of actions we want to send user a notification for:
// - New order (store managers)
// - Payout confirmed (when Paystack confirms the transaction is sent)
// - New follower (store managers)
// - Order fulfilled (user)
// - Delivery confirmed (store managers)

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
				console.log({ tickets });
			} catch (error) {
				console.log({ error });
			}
		}
	}
}

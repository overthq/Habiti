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

// Architecture:
// When we call ctx.services.notifications.queueMessage(...), a message gets
// added to the queue. Every minute (or maybe 15 seconds), we get all items
// in the queue and dump them into the expo.chunkPushNotifications(...)
// method, which chunks and sends them.
//
// In the future, we can also commit the messages if they reach a certain
// count threshold and/or tweak the batch time.
//
// I'm a little worried that it isn't trivial to implement something that
// works at scale here. Resetting messages to an empty array is a little
// risky, if it's possible for that array to have been appended to after
// chunking. A very trivial way to mitigate this is to store the array length
// before chunking and check if it has changed after.
//
// Who ever said that mutexes aren't useful?

const BATCH_TIME = 15 * 1000;

export default class NotificationsService {
	private messages = [];

	constructor() {
		setInterval(() => {
			this.sendMessages();
		}, BATCH_TIME);
	}

	queueMessage(message: ExpoPushMessage) {
		this.messages.push(message);
	}

	async sendMessages() {
		const chunks = expo.chunkPushNotifications(this.messages);

		// Reset messages to make sure we don't send them again.
		this.messages = [];

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

import { Expo, ExpoPushMessage } from 'expo-server-sdk';

const expo = new Expo();

// Initial list of actions we want to send user a notification for:
// - New order (store managers)
// - Payout confirmed (when Paystack confirms the transaction is sent)
// - New follower (store managers)
// - Order fulfilled (user)
// - Delivery confirmed (store managers)

const BATCH_TIME = 15 * 1000;

export default class NotificationsService {
	private messages: ExpoPushMessage[] = [];
	private isProcessing = false;
	private pendingMessages: ExpoPushMessage[] = [];

	constructor() {
		setInterval(() => {
			this.sendMessages();
		}, BATCH_TIME);
	}

	queueMessage(message: ExpoPushMessage) {
		this.messages.push(message);
	}

	private async sendMessages() {
		// Prevent concurrent processing
		if (this.isProcessing) {
			return;
		}

		this.isProcessing = true;

		try {
			// Safely capture current messages
			const messagesToSend = [...this.messages];
			this.messages = [];

			// Process chunks
			const chunks = expo.chunkPushNotifications(messagesToSend);

			for (const chunk of chunks) {
				try {
					const tickets = await expo.sendPushNotificationsAsync(chunk);
					console.log({ tickets });
				} catch (error) {
					// If sending fails, add back to pending messages
					this.pendingMessages.push(...chunk);
					console.error('Failed to send notifications:', error);
				}
			}

			// Retry pending messages from previous failures
			if (this.pendingMessages.length > 0) {
				this.messages.push(...this.pendingMessages);
				this.pendingMessages = [];
			}
		} finally {
			this.isProcessing = false;
		}
	}
}

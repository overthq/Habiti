import { Expo, ExpoPushMessage } from 'expo-server-sdk';

import {
	type NotificationPayload,
	notificationTemplates,
	getNotificationUrl
} from '../core/notifications';
import { rootLogger } from './logger';

const expo = new Expo();

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

	queueNotification(payload: NotificationPayload) {
		const template = notificationTemplates[payload.type];

		if (!template) {
			rootLogger.error(
				{ type: payload.type },
				'notifications.template_missing'
			);
			return;
		}

		const url = getNotificationUrl(payload.type, payload.data);

		const messages: ExpoPushMessage[] = payload.recipientTokens.map(token => ({
			to: token,
			title: template.title,
			body: template.body(payload.data),
			data: {
				type: payload.type,
				...payload.data,
				...(url ? { url } : {})
			}
		}));

		this.messages.push(...messages);
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
					rootLogger.debug(
						{ ticketCount: tickets.length },
						'notifications.sent'
					);
				} catch (error) {
					// If sending fails, add back to pending messages
					this.pendingMessages.push(...chunk);
					rootLogger.error({ err: error }, 'notifications.send_failed');
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

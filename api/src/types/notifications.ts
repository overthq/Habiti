export type NotificationType =
	| 'NEW_ORDER'
	| 'PAYOUT_CONFIRMED'
	| 'NEW_FOLLOWER'
	| 'ORDER_FULFILLED'
	| 'DELIVERY_CONFIRMED'
	| 'ORDER_CANCELLED'
	| 'ORDER_COMPLETED';

export interface NotificationTemplate {
	title: string;
	body: (data: any) => string;
}

export interface NotificationPayload {
	type: NotificationType;
	data: any;
	recipientTokens: string[];
}

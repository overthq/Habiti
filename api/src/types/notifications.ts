export enum NotificationType {
	NewOrder = 'NEW_ORDER',
	PayoutConfirmed = 'PAYOUT_CONFIRMED',
	NewFollower = 'NEW_FOLLOWER',
	OrderFulfilled = 'ORDER_FULFILLED',
	DeliveryConfirmed = 'DELIVERY_CONFIRMED',
	OrderCancelled = 'ORDER_CANCELLED',
	OrderCompleted = 'ORDER_COMPLETED',
	OrderStatusChanged = 'ORDER_STATUS_CHANGED'
}

export interface NotificationTemplate {
	title: string;
	body: (data: any) => string;
}

export interface NotificationPayload {
	type: NotificationType;
	data: any;
	recipientTokens: string[];
}

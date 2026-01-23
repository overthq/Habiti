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

export const notificationTemplates: Record<
	NotificationType,
	NotificationTemplate
> = {
	NEW_ORDER: {
		title: 'New Order Received',
		body: data => `${data.customerName} placed an order for ${data.amount}`
	},
	PAYOUT_CONFIRMED: {
		title: 'Payout Successful',
		body: data => `Your payout of ${data.amount} has been processed`
	},
	NEW_FOLLOWER: {
		title: 'New Store Follower',
		body: data => `${data.followerName} started following your store`
	},
	ORDER_FULFILLED: {
		title: 'Order Fulfilled',
		body: data => `Your order #${data.orderId} has been fulfilled`
	},
	DELIVERY_CONFIRMED: {
		title: 'Delivery Confirmed',
		body: data => `Order #${data.orderId} has been delivered`
	},
	ORDER_CANCELLED: {
		title: 'Order Cancelled',
		body: data => `Your order #${data.orderId} has been cancelled`
	},
	ORDER_COMPLETED: {
		title: 'Order Completed',
		body: data => `Your order #${data.orderId} has been completed`
	},
	ORDER_STATUS_CHANGED: {
		title: 'Order Status Changed',
		body: data =>
			`Your order #${data.orderId}'s status has been updated to ${data.status}`
	}
};

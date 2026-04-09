export enum NotificationType {
	NewOrder = 'NEW_ORDER',
	PayoutConfirmed = 'PAYOUT_CONFIRMED',
	NewFollower = 'NEW_FOLLOWER',
	OrderFulfilled = 'ORDER_FULFILLED',
	DeliveryConfirmed = 'DELIVERY_CONFIRMED',
	OrderCancelled = 'ORDER_CANCELLED',
	OrderCompleted = 'ORDER_COMPLETED',
	ReadyForPickup = 'READY_FOR_PICKUP',
	OrderStatusChanged = 'ORDER_STATUS_CHANGED',
	LowStock = 'LOW_STOCK'
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

const DASHBOARD_SCHEME = 'habiti-dashboard';

export function getNotificationUrl(
	type: NotificationType,
	data: Record<string, any>
): string | undefined {
	switch (type) {
		case NotificationType.NewOrder:
			return `${DASHBOARD_SCHEME}://orders/${data.orderId}`;
		case NotificationType.PayoutConfirmed:
			return data.transactionId
				? `${DASHBOARD_SCHEME}://store/transactions/${data.transactionId}`
				: `${DASHBOARD_SCHEME}://store/payouts`;
		case NotificationType.LowStock:
			return `${DASHBOARD_SCHEME}://products/${data.productId}`;
		default:
			return undefined;
	}
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
	READY_FOR_PICKUP: {
		title: 'Order Ready for Pickup',
		body: (data: any) => `Your order #${data.orderId} is ready for pickup`
	},
	ORDER_STATUS_CHANGED: {
		title: 'Order Status Changed',
		body: data =>
			`Your order #${data.orderId}'s status has been updated to ${data.status}`
	},
	LOW_STOCK: {
		title: 'Low Stock Alert',
		body: data =>
			`${data.productName} is running low (${data.quantity} remaining)`
	}
};

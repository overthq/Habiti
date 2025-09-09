import { OrderStatus } from '@prisma/client';
import { NotificationType } from '../notifications';

export interface CreateOrderInput {
	cartId: string;
	cardId?: string;
	transactionFee: number;
	serviceFee: number;
}

export interface UpdateOrderStatusInput {
	orderId: string;
	status: OrderStatus;
}

type OrderNotificationType =
	| NotificationType.NewOrder
	| NotificationType.OrderStatusChanged
	| NotificationType.OrderCompleted
	| NotificationType.OrderCancelled;

export interface OrderNotification {
	type: OrderNotificationType;
	data: {
		orderId: string;
		storeId: string;
		status: OrderStatus;
		customerName: string;
		amount: number;
	};
}

export interface OrderRevenueUpdate {
	storeId: string;
	realized: number;
	unrealized: number;
}

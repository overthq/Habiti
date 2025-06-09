import { Order, OrderStatus } from '@prisma/client';
import { NotificationType } from '../../../types/notifications';
import { AnalyticsEvent } from '../../../services/analytics';

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

export interface OrderCreationResult {
	order: Order;
	sideEffects: OrderSideEffects;
}

export interface OrderUpdateResult {
	order: Order;
	sideEffects: OrderSideEffects;
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

export interface OrderSideEffects {
	notifications: OrderNotification[];
	revenueUpdate: OrderRevenueUpdate | undefined;
	analyticsEvents: AnalyticsEvent[];
}

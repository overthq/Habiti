import { OrderStatus } from '../data/types';

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
	[OrderStatus.Pending]: 'Pending',
	[OrderStatus.PaymentPending]: 'Payment Pending',
	[OrderStatus.ReadyForPickup]: 'Ready for Pickup',
	[OrderStatus.Completed]: 'Completed',
	[OrderStatus.Cancelled]: 'Cancelled'
};

export const ORDER_STATUS_COLOR_VARIANTS: Record<
	OrderStatus,
	'success' | 'danger' | 'warning'
> = {
	[OrderStatus.Cancelled]: 'danger',
	[OrderStatus.Completed]: 'success',
	[OrderStatus.Pending]: 'warning',
	[OrderStatus.PaymentPending]: 'warning',
	[OrderStatus.ReadyForPickup]: 'warning'
};

import { OrderStatus } from '@/data/types';

const statusMap = {
	[OrderStatus.Pending]: {
		label: 'Pending',
		variant: 'outline'
	},
	[OrderStatus.Completed]: {
		label: 'Completed',
		variant: 'default'
	},
	[OrderStatus.Cancelled]: {
		label: 'Cancelled',
		variant: 'destructive'
	},
	[OrderStatus.PaymentPending]: {
		label: 'Payment Pending',
		variant: 'outline'
	},
	[OrderStatus.ReadyForPickup]: {
		label: 'Ready for pickup',
		variant: 'outline'
	}
} as const;

export const getStatus = (status: OrderStatus) => {
	return statusMap[status];
};

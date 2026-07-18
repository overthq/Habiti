import { OrderStatus } from '@/data/types';
import { getStatus } from '@/utils/status';
import StatusPill, { type StatusTone } from './status-pill';

interface OrderStatusPillProps {
	status: OrderStatus;
}

const statusTones: Record<OrderStatus, StatusTone> = {
	[OrderStatus.Pending]: 'yellow',
	[OrderStatus.PaymentPending]: 'gray',
	[OrderStatus.Completed]: 'green',
	[OrderStatus.Cancelled]: 'red',
	[OrderStatus.ReadyForPickup]: 'gray'
};

const OrderStatusPill = ({ status }: OrderStatusPillProps) => {
	return (
		<StatusPill tone={statusTones[status]} label={getStatus(status).label} />
	);
};

export default OrderStatusPill;

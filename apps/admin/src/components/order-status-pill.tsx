import { OrderStatus } from '@/data/types';
import { Badge } from './ui/badge';
import { getStatus } from '@/utils/status';

interface OrderStatusPillProps {
	status: OrderStatus;
}

const OrderStatusPill = ({ status }: OrderStatusPillProps) => {
	const statusData = getStatus(status);
	return <Badge variant={statusData.variant}>{statusData.label}</Badge>;
};

export default OrderStatusPill;

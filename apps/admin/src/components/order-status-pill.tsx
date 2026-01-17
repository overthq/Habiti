import { OrderStatus } from '@/data/types';
import { Badge } from './ui/badge';
import { getStatus } from '@/utils/status';

interface OrderStatusPillProps {
	status: OrderStatus;
}

const OrderStatusPill = ({ status }: OrderStatusPillProps) => {
	const statusData = getStatus(status);

	const getBadgeColor = () => {
		switch (status) {
			case OrderStatus.Pending:
				return (
					<div className='bg-yellow-500 dark:bg-yellow-400 size-2 rounded-full' />
				);
			case OrderStatus.Completed:
				return (
					<div className='bg-green-500 dark:bg-green-400 size-2 rounded-full' />
				);
			case OrderStatus.Cancelled:
				return (
					<div className='bg-red-500 dark:bg-red-400 size-2 rounded-full' />
				);
			case OrderStatus.PaymentPending:
			default:
				return (
					<div className='bg-gray-500 dark:bg-gray-400 size-2 rounded-full' />
				);
		}
	};

	return (
		<Badge variant='outline'>
			{getBadgeColor()}
			{statusData.label}
		</Badge>
	);
};

export default OrderStatusPill;

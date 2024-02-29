import { Badge } from '@market/components';
import React from 'react';

import { OrderStatus } from '../../types/api';

const StatusColorMap = {
	[OrderStatus.Cancelled]: 'danger',
	[OrderStatus.Completed]: 'success',
	[OrderStatus.Delivered]: 'success',
	[OrderStatus.Pending]: 'warning',
	[OrderStatus.Processing]: 'warning'
} as const;

interface StatusPillProps {
	status: OrderStatus;
}

const StatusPill: React.FC<StatusPillProps> = ({ status }) => (
	<Badge variant={StatusColorMap[status]} text={status} />
);

export default StatusPill;

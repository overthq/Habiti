import { Badge } from '@habiti/components';
import React from 'react';

import { OrderStatus } from '../../types/api';

const StatusColorMap = {
	[OrderStatus.Cancelled]: 'danger',
	[OrderStatus.Completed]: 'success',
	[OrderStatus.Pending]: 'warning'
} as const;

interface StatusPillProps {
	status: OrderStatus;
}

const StatusPill: React.FC<StatusPillProps> = ({ status }) => (
	<Badge variant={StatusColorMap[status]} text={status} />
);

export default StatusPill;

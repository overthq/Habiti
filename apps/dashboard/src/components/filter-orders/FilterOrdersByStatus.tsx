import React from 'react';
import { SelectGroup, Spacer } from '@habiti/components';
import { OrderStatus } from '../../data/types';

interface FilterOrdersByStatusProps {
	selectedStatus?: OrderStatus;
	onSelectStatus: (status: OrderStatus | undefined) => void;
}

const FilterOrdersByStatus = ({
	selectedStatus,
	onSelectStatus
}: FilterOrdersByStatusProps) => {
	return (
		<>
			<Spacer y={8} />
			<SelectGroup
				selected={selectedStatus}
				options={[
					{ title: 'All', value: undefined },
					{ title: 'Pending', value: OrderStatus.Pending },
					{ title: 'Ready for Pickup', value: OrderStatus.ReadyForPickup },
					{ title: 'Completed', value: OrderStatus.Completed },
					{ title: 'Cancelled', value: OrderStatus.Cancelled }
				]}
				onSelect={onSelectStatus}
			/>
			<Spacer y={4} />
		</>
	);
};

export default FilterOrdersByStatus;

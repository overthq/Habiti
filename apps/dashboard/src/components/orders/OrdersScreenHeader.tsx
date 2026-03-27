import { Pressable } from 'react-native';
import { Icon, ScreenHeader } from '@habiti/components';

import { useOrdersContext } from './OrdersContext';
import OrderStatusPills from './OrderStatusPills';

const OrdersScreenHeader = () => {
	const { openFilterModal } = useOrdersContext();

	return (
		<ScreenHeader
			title='Orders'
			right={
				<Pressable onPress={openFilterModal}>
					<Icon name='sliders-horizontal' size={20} />
				</Pressable>
			}
			hasBottomBorder
		>
			<OrderStatusPills />
		</ScreenHeader>
	);
};
export default OrdersScreenHeader;

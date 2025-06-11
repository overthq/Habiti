import React from 'react';
import { Pressable } from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Icon, Screen, ScreenHeader } from '@habiti/components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import OrdersList from '../components/orders/OrdersList';
import OrdersFilterModal from '../components/orders/OrdersFilterModal';
import { OrdersProvider } from '../components/orders/OrdersContext';

const Orders: React.FC = () => {
	const { top } = useSafeAreaInsets();
	const filterModalRef = React.useRef<BottomSheetModal>(null);

	const handleOpenFilterSheet = () => {
		filterModalRef.current?.present();
	};

	return (
		<OrdersProvider>
			<Screen style={{ paddingTop: top }}>
				<ScreenHeader
					title='Orders'
					right={
						<Pressable onPress={handleOpenFilterSheet}>
							<Icon name='sliders-horizontal' size={20} />
						</Pressable>
					}
					hasBottomBorder
				/>
				<OrdersList />
				<OrdersFilterModal modalRef={filterModalRef} />
			</Screen>
		</OrdersProvider>
	);
};

export default Orders;

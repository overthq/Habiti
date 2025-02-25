import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { Linking, View } from 'react-native';

import StoreMenuRow from './StoreMenuRow';
import useStore from '../../state';
import type { StoreStackParamList } from '../../types/navigation';
import StoreSelectModal from './StoreSelectModal';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Separator, Spacer } from '@habiti/components';
import { StoreQuery } from '../../types/api';

const PRIVACY_POLICY_URL = 'https://habiti.app/privacy-policy';
const SUPPORT_URL = 'https://habiti.app/support';
const ACCEPTABLE_USE_URL = 'https://habiti.app/acceptable-use-policy';

interface StoreMenuProps {
	store: StoreQuery['currentStore'];
}

const StoreMenu: React.FC<StoreMenuProps> = ({ store }) => {
	const { navigate } = useNavigation<NavigationProp<StoreStackParamList>>();
	const { logOut } = useStore();
	const modalRef = React.useRef<BottomSheetModal>(null);

	const handleNavigate = React.useCallback(
		(screen: keyof StoreStackParamList) => () => {
			navigate(screen);
		},
		[]
	);

	return (
		<View>
			<Spacer y={16} />
			<StoreMenuRow
				title='Current store'
				onPress={() => modalRef.current?.present()}
				display={store?.name}
				icon='chevrons-up-down'
			/>
			<StoreMenuRow title='Edit Store' onPress={handleNavigate('Edit Store')} />
			<StoreMenuRow title='Payouts' onPress={handleNavigate('Payouts')} />
			<StoreMenuRow title='Categories' onPress={handleNavigate('Categories')} />
			<StoreMenuRow title='Settings' onPress={handleNavigate('Settings')} />
			<StoreMenuRow title='Appearance' onPress={handleNavigate('Appearance')} />
			<Separator style={{ marginHorizontal: 16, marginVertical: 8 }} />
			<StoreMenuRow
				title='Privacy Policy'
				onPress={() => {
					Linking.openURL(PRIVACY_POLICY_URL);
				}}
			/>
			<StoreMenuRow
				title='Support'
				onPress={() => {
					Linking.openURL(SUPPORT_URL);
				}}
			/>
			<StoreMenuRow
				title='Acceptable Use'
				onPress={() => {
					Linking.openURL(ACCEPTABLE_USE_URL);
				}}
			/>
			<Separator style={{ marginHorizontal: 16, marginVertical: 8 }} />
			<StoreMenuRow
				title='Log Out'
				onPress={logOut}
				icon='log-out'
				destructive
			/>
			<StoreSelectModal modalRef={modalRef} />
		</View>
	);
};

export default StoreMenu;

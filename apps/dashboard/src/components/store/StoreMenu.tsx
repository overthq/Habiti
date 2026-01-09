import React from 'react';
import { Alert, Linking, View } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';

import StoreMenuRow from './StoreMenuRow';
import useStore from '../../state';
import type { StoreStackParamList } from '../../types/navigation';
import StoreSelectModal from './StoreSelectModal';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Separator } from '@habiti/components';
import { StoreQuery } from '../../types/api';

const PRIVACY_POLICY_URL = 'https://habiti.app/privacy-policy';
const SUPPORT_URL = 'https://habiti.app/support';
const ACCEPTABLE_USE_URL = 'https://habiti.app/acceptable-use';

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

	const handleLogOut = React.useCallback(() => {
		Alert.alert('Log out', 'Are you sure you want to log out?', [
			{
				text: 'Cancel',
				style: 'cancel'
			},
			{ text: 'Log out', onPress: logOut }
		]);
	}, [logOut]);

	const storeDisplayName = store?.unlisted
		? `${store?.name} (Unlisted)`
		: store?.name;

	return (
		<View>
			<StoreMenuRow
				title='Current store'
				onPress={() => modalRef.current?.present()}
				display={storeDisplayName}
				icon='chevrons-up-down'
			/>
			<StoreMenuRow title='Edit Store' onPress={handleNavigate('Edit Store')} />
			<StoreMenuRow title='Payouts' onPress={handleNavigate('Payouts')} />
			<StoreMenuRow title='Categories' onPress={handleNavigate('Categories')} />
			<StoreMenuRow title='Settings' onPress={handleNavigate('Settings')} />
			<StoreMenuRow title='Appearance' onPress={handleNavigate('Appearance')} />
			<Separator style={{ marginHorizontal: 16, marginVertical: 8 }} />
			<StoreMenuRow
				title='Privacy'
				onPress={() => {
					Linking.openURL(PRIVACY_POLICY_URL);
				}}
				icon='arrow-up-right'
			/>
			<StoreMenuRow
				title='Support'
				onPress={() => {
					Linking.openURL(SUPPORT_URL);
				}}
				icon='arrow-up-right'
			/>
			<StoreMenuRow
				title='Acceptable Use'
				onPress={() => {
					Linking.openURL(ACCEPTABLE_USE_URL);
				}}
				icon='arrow-up-right'
			/>
			<Separator style={{ marginHorizontal: 16, marginVertical: 8 }} />
			<StoreMenuRow
				title='Log out'
				onPress={handleLogOut}
				icon='log-out'
				destructive
			/>
			<StoreSelectModal modalRef={modalRef} />
		</View>
	);
};

export default StoreMenu;

import React from 'react';
import { Alert, Linking, StyleSheet, View } from 'react-native';
import {
	Avatar,
	Screen,
	ScreenHeader,
	Separator,
	Typography,
	useTheme
} from '@habiti/components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import StoreMenuRow from '../components/store/StoreMenuRow';
import { useCurrentUserQuery } from '../data/queries';
import useStore from '../state';
import type { ProfileStackScreenProps } from '../navigation/types';

const PRIVACY_POLICY_URL = 'https://habiti.app/privacy-policy';
const SUPPORT_URL = 'https://habiti.app/support';
const ACCEPTABLE_USE_URL = 'https://habiti.app/acceptable-use';

const Profile = ({ navigation }: ProfileStackScreenProps<'ProfileHome'>) => {
	const { top } = useSafeAreaInsets();
	const { theme } = useTheme();
	const { logOut } = useStore();
	const { data } = useCurrentUserQuery();

	const user = data?.user;

	const handleLogOut = React.useCallback(() => {
		Alert.alert('Log out', 'Are you sure you want to log out?', [
			{ text: 'Cancel', style: 'cancel' },
			{ text: 'Log out', onPress: logOut }
		]);
	}, [logOut]);

	return (
		<Screen style={{ paddingTop: top }}>
			<ScreenHeader title='Profile' />
			{user && (
				<View
					style={[styles.userCard, { backgroundColor: theme.input.background }]}
				>
					<Avatar size={56} fallbackText={user.name} />
					<View style={styles.userInfo}>
						<Typography weight='medium' size='large'>
							{user.name}
						</Typography>
						<Typography variant='secondary'>{user.email}</Typography>
					</View>
				</View>
			)}
			<View>
				<StoreMenuRow
					title='Manage Account'
					onPress={() => navigation.navigate('ManageAccount')}
				/>
				<StoreMenuRow
					title='Appearance'
					onPress={() => navigation.navigate('Appearance')}
				/>
				<Separator style={{ marginHorizontal: 16, marginVertical: 8 }} />
				<StoreMenuRow
					title='Privacy'
					onPress={() => Linking.openURL(PRIVACY_POLICY_URL)}
					icon='arrow-up-right'
				/>
				<StoreMenuRow
					title='Support'
					onPress={() => Linking.openURL(SUPPORT_URL)}
					icon='arrow-up-right'
				/>
				<StoreMenuRow
					title='Acceptable Use'
					onPress={() => Linking.openURL(ACCEPTABLE_USE_URL)}
					icon='arrow-up-right'
				/>
				<Separator style={{ marginHorizontal: 16, marginVertical: 8 }} />
				<StoreMenuRow
					title='Log out'
					onPress={handleLogOut}
					icon='log-out'
					destructive
				/>
			</View>
		</Screen>
	);
};

const styles = StyleSheet.create({
	userCard: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 16,
		marginHorizontal: 16,
		marginBottom: 12,
		borderRadius: 12
	},
	userInfo: {
		marginLeft: 12,
		flex: 1
	}
});

export default Profile;

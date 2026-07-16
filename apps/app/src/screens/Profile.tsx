import React from 'react';
import {
	ActivityIndicator,
	Alert,
	Linking,
	Pressable,
	StyleSheet,
	View
} from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import {
	Avatar,
	Button,
	Icon,
	IconType,
	Row,
	Screen,
	Separator,
	Spacer,
	Typography,
	useTheme
} from '@habiti/components';
import { useCurrentUserQuery } from '../data/queries';
import { useLogoutMutation } from '../hooks/mutations';
import { useIsGuest, useOpenAuthModal } from '../hooks/useAuth';

import {
	ProfileStackParamList,
	ProfileStackScreenProps
} from '../navigation/types';
import { useHeaderHeight } from '@react-navigation/elements';

const PRIVACY_POLICY_URL = 'https://habiti.app/privacy-policy';
const SUPPORT_URL = 'https://habiti.app/support';
const ACCEPTABLE_USE_URL = 'https://habiti.app/acceptable-use';

/* Account Settings:
  - Account Info
  - Addresses
  - Loyalty Cards (list followed stores that support loyalty cards.)
  - Country*
	- Habiti Pro* (subscription membership with perks).
* About this app
  - Legal
	- TOS
	- Privacy Policy
	- OSS Packages*
	- Version Number*
* Support
* Set up your own store*/

const Profile: React.FC<ProfileStackScreenProps<'Profile.Main'>> = ({
	navigation
}) => {
	const headerHeight = useHeaderHeight();
	const openAuthModal = useOpenAuthModal();
	const logoutMutation = useLogoutMutation();
	const isGuest = useIsGuest();

	const confirmLogOut = React.useCallback(() => {
		Alert.alert('Log Out', 'Are you sure you want to log out?', [
			{ text: 'Cancel', style: 'cancel' },
			{
				text: 'Log Out',
				style: 'destructive',
				onPress: () => logoutMutation.mutate()
			}
		]);
	}, [logoutMutation]);

	return (
		<Screen>
			<Spacer y={headerHeight} />

			{isGuest ? <SignInCard onPress={() => openAuthModal()} /> : <UserCard />}

			<Spacer y={12} />

			{/* Everything here needs an account behind it, so it stays hidden
			    until the user has one. */}
			{!isGuest && (
				<>
					<ProfileRow
						title='Manage Account'
						onPress={() => navigation.navigate('Profile.AccountSettings')}
					/>

					<ProfileRow
						title='Payment Methods'
						onPress={() => navigation.navigate('Profile.PaymentMethods')}
					/>

					<ProfileRow
						title='Notifications'
						onPress={() => navigation.navigate('Profile.NotificationSettings')}
					/>
				</>
			)}

			<ProfileRow
				title='Appearance'
				onPress={() => navigation.navigate('Profile.Appearance')}
			/>

			<Separator />

			<ProfileRow
				title='Privacy Policy'
				onPress={() => {
					Linking.openURL(PRIVACY_POLICY_URL);
				}}
				icon='arrow-up-right'
			/>

			<ProfileRow
				title='Support'
				onPress={() => {
					Linking.openURL(SUPPORT_URL);
				}}
				icon='arrow-up-right'
			/>

			<ProfileRow
				title='Acceptable Use'
				onPress={() => {
					Linking.openURL(ACCEPTABLE_USE_URL);
				}}
				icon='arrow-up-right'
			/>

			{!isGuest && (
				<ProfileRow
					title='Log Out'
					onPress={confirmLogOut}
					icon='log-out'
					destructive
				/>
			)}
		</Screen>
	);
};

interface ProfileRowProps {
	title: string;
	onPress(): void;
	icon?: IconType;
	destructive?: boolean;
}

const ProfileRow: React.FC<ProfileRowProps> = ({
	title,
	onPress,
	icon = 'chevron-right',
	destructive = false
}) => {
	const { theme } = useTheme();

	return (
		<Row style={styles.row} onPress={onPress}>
			<Typography variant={destructive ? 'error' : 'primary'}>
				{title}
			</Typography>
			<Icon
				name={icon}
				color={destructive ? theme.text.error : theme.text.secondary}
				size={20}
			/>
		</Row>
	);
};

interface SignInCardProps {
	onPress(): void;
}

const SignInCard: React.FC<SignInCardProps> = ({ onPress }) => {
	const { theme } = useTheme();

	return (
		<View
			style={[styles.signInCard, { backgroundColor: theme.input.background }]}
		>
			<Typography weight='medium' size='large'>
				{`You're browsing as a guest`}
			</Typography>

			<Spacer y={4} />

			<Typography variant='secondary' size='small'>
				Sign in to place orders, track deliveries and keep your carts across
				devices.
			</Typography>

			<Spacer y={16} />

			<Button text='Sign in' onPress={onPress} />
		</View>
	);
};

const UserCard: React.FC = () => {
	const { navigate } = useNavigation<NavigationProp<ProfileStackParamList>>();

	const { theme } = useTheme();
	const { data, isLoading } = useCurrentUserQuery();

	if (isLoading || !data) {
		return (
			<View>
				<ActivityIndicator />
			</View>
		);
	}

	return (
		<Pressable
			onPress={() => navigate('Profile.Edit')}
			style={[styles.card, { backgroundColor: theme.input.background }]}
		>
			<Avatar size={56} circle fallbackText={data.user.name} />
			<View style={{ marginLeft: 12 }}>
				<Typography weight='medium'>{data.user.name}</Typography>
				{data.user.email ? (
					<>
						<Spacer y={2} />
						<Typography variant='secondary'>{data.user.email}</Typography>
					</>
				) : null}
			</View>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	row: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 12,
		marginHorizontal: -16
	},
	card: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 16,
		borderRadius: 12
	},
	signInCard: {
		padding: 16,
		borderRadius: 12
	}
});

export default Profile;

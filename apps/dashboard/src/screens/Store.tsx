import React from 'react';
import { Alert, Linking, Pressable, StyleSheet, View } from 'react-native';
import {
	Avatar,
	Button,
	Icon,
	IconButton,
	PillButton,
	Screen,
	ScrollableScreen,
	Separator,
	Spacer,
	Typography,
	useTheme
} from '@habiti/components';
import { formatNaira } from '@habiti/common';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useShallow } from 'zustand/react/shallow';

import Refresher from '../components/Refresher';
import StoreMenuRow from '../components/StoreMenuRow';
import { useSheet } from '../navigation/useSheet';
import { useAddressesQuery, useCurrentStoreQuery } from '../data/queries';
import useRefresh from '../hooks/useRefresh';
import useStore from '../state';
import { getFrontendUrl } from '../utils/share';
import type { Store as StoreType, Address } from '../data/types';
import type {
	AppStackParamList,
	StoreStackParamList,
	StoreStackScreenProps
} from '../navigation/types';

type ParamlessStoreRoute = {
	[K in keyof StoreStackParamList]: StoreStackParamList[K] extends undefined
		? K
		: never;
}[keyof StoreStackParamList];

const Store: React.FC<StoreStackScreenProps<'StoreHome'>> = ({
	navigation
}) => {
	const { data, refetch, isLoading, isRefetching, error } =
		useCurrentStoreQuery();
	const { data: addressesData } = useAddressesQuery();
	const { isRefreshing, onRefresh } = useRefresh({ refetch, isRefetching });
	const { top } = useSafeAreaInsets();
	const { logOut } = useStore(useShallow(({ logOut }) => ({ logOut })));
	const { openSheet } = useSheet();

	const handleNewPayout = () => {
		if (!data?.store) return;

		if (!data.store.bankAccountNumber) {
			Alert.alert(
				'No bank account linked',
				'You must link a bank account before requesting a payout'
			);

			return;
		}

		navigation.navigate('Modal.AddPayout', {
			realizedRevenue: data.store.realizedRevenue ?? 0,
			paidOut: data.store.paidOut ?? 0
		});
	};

	const handleSwitchStore = React.useCallback(() => {
		openSheet('storeSelect');
	}, [openSheet]);

	const handleOpenBalanceDetails = React.useCallback(() => {
		navigation.navigate('BalanceDetails');
	}, [navigation]);

	const handleNavigate = React.useCallback(
		(screen: ParamlessStoreRoute) => () => {
			navigation.navigate(screen);
		},
		[navigation]
	);

	const handleOpenWebPage = React.useCallback(() => {
		if (data?.store) {
			Linking.openURL(getFrontendUrl(`/store/${data.store.id}`));
		}
	}, [data?.store]);

	if (isLoading || !data?.store) {
		return <View />;
	}

	if (error) {
		return (
			<View>
				<Button text='Log Out' onPress={logOut} />
			</View>
		);
	}

	const store = data.store;
	const available = (store.realizedRevenue ?? 0) - (store.paidOut ?? 0);

	return (
		<Screen style={{ paddingTop: top }}>
			<StoreHeader
				store={store}
				onOpenWebPage={handleOpenWebPage}
				onSwitchStore={handleSwitchStore}
			/>

			<ScrollableScreen
				style={{ marginHorizontal: -16 }}
				refreshControl={
					<Refresher refreshing={isRefreshing} onRefresh={onRefresh} />
				}
			>
				<Spacer y={16} />

				<View>
					<Typography variant='secondary' size='small' weight='medium'>
						Available
					</Typography>

					<Spacer y={8} />

					<Typography size='xxxlarge' weight='bold'>
						{formatNaira(available)}
					</Typography>
				</View>

				<Spacer y={16} />

				<View style={styles.actions}>
					<PillButton
						text='Request payout'
						onPress={handleNewPayout}
						style={{ flex: 1 }}
					/>

					<Spacer x={8} />

					<PillButton
						text='Manage'
						variant='secondary'
						onPress={handleOpenBalanceDetails}
						style={{ flex: 1 }}
					/>
				</View>

				<Spacer y={16} />

				<OnboardingChecklist
					store={store}
					addresses={addressesData?.addresses ?? []}
				/>

				<Separator />

				<Spacer y={8} />

				<View>
					<StoreMenuRow
						title='Edit Store'
						onPress={handleNavigate('EditStore')}
					/>
					<StoreMenuRow
						title='Payout Account'
						onPress={handleNavigate('PayoutAccount')}
					/>
					<StoreMenuRow
						title='Categories'
						onPress={handleNavigate('Categories')}
					/>
					<StoreMenuRow
						title='Addresses'
						onPress={handleNavigate('Addresses')}
					/>
					<StoreMenuRow
						title='Manage Store'
						onPress={handleNavigate('ManageStore')}
					/>
				</View>

				<Spacer y={16} />
			</ScrollableScreen>
		</Screen>
	);
};

const styles = StyleSheet.create({
	storeInfo: {
		flexDirection: 'row',
		alignItems: 'center'
	},

	actions: {
		flexDirection: 'row'
	}
});

interface StoreHeaderProps {
	store: StoreType;
	onSwitchStore: () => void;
	onOpenWebPage: () => void;
}

const StoreHeader = ({
	store,
	onSwitchStore,
	onOpenWebPage
}: StoreHeaderProps) => {
	const { theme } = useTheme();

	return (
		<View
			style={[headerStyles.header, { borderBottomColor: theme.border.color }]}
		>
			<Pressable
				onPress={onSwitchStore}
				style={{ flexDirection: 'row', alignItems: 'center' }}
			>
				<Avatar
					uri={store.image?.path}
					fallbackText={store.name}
					size={32}
					circle
				/>
				<Spacer x={10} />
				<Typography size='xxlarge' weight='bold'>
					{store.name}
				</Typography>
				<Spacer x={4} />
				<Icon name='chevron-down' size={20} />
			</Pressable>

			<IconButton name='globe' size={22} onPress={onOpenWebPage} inset />
		</View>
	);
};

const headerStyles = StyleSheet.create({
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginHorizontal: -16,
		paddingHorizontal: 16,
		paddingVertical: 12,
		borderBottomWidth: StyleSheet.hairlineWidth
	}
});

enum OnboardingRequirement {
	UploadStoreImage = 'UploadStoreImage',
	AtLeastOneProduct = 'AtLeastOneProduct',
	AtLeastOneAddress = 'AtLeastOneAddress',
	LinkBankAccount = 'LinkBankAccount'
}

const onboardingRequirementsConfig = ({
	store,
	addresses
}: {
	store: StoreType;
	addresses: Address[];
}) =>
	[
		{
			id: OnboardingRequirement.UploadStoreImage,
			label: 'Upload a store image',
			condition: !!store.image,
			targetScreen: 'EditStore'
		},
		{
			id: OnboardingRequirement.AtLeastOneProduct,
			label: 'Add at least one product',
			condition: store.products.length > 0,
			targetScreen: 'Modal.AddProduct'
		},
		{
			id: OnboardingRequirement.AtLeastOneAddress,
			label: 'Add at least one address',
			condition: addresses.length > 0,
			targetScreen: 'Modal.AddAddress'
		},
		{
			id: OnboardingRequirement.LinkBankAccount,
			label: 'Link a bank account',
			condition: !!store.bankAccountNumber,
			targetScreen: 'Modal.AddPayoutAccount'
		}
	] as const;

const getOnboardingCompletionCount = (
	items: ReturnType<typeof onboardingRequirementsConfig>
) => {
	return items.filter(x => x.condition).length;
};

interface OnboardingChecklistProps {
	store: StoreType;
	addresses: Address[];
}

const OnboardingChecklist: React.FC<OnboardingChecklistProps> = ({
	store,
	addresses
}) => {
	const { theme } = useTheme();
	const { navigate } =
		useNavigation<NavigationProp<AppStackParamList & StoreStackParamList>>();

	const items = onboardingRequirementsConfig({ store, addresses });

	const completedCount = getOnboardingCompletionCount(items);

	if (completedCount === items.length) return null;

	return (
		<View>
			<Separator />

			<Spacer y={16} />

			<Typography weight='medium'>Finish setting up your store</Typography>

			<Spacer y={4} />

			<Typography variant='secondary' size='small'>
				{completedCount} of {items.length} completed
			</Typography>

			<Spacer y={8} />

			<View
				style={[
					checklistStyles.container,
					{ backgroundColor: theme.input.background }
				]}
			>
				{items.map((item, index) => (
					<React.Fragment key={item.label}>
						<ChecklistItem
							label={item.label}
							completed={item.condition}
							onPress={() => {
								navigate(item.targetScreen);
							}}
						/>
						{index !== items.length - 1 && <Separator />}
					</React.Fragment>
				))}
			</View>

			<Spacer y={16} />
		</View>
	);
};

interface ChecklistItemProps {
	label: string;
	completed: boolean;
	onPress?: () => void;
}

const ChecklistItem: React.FC<ChecklistItemProps> = ({
	label,
	completed,
	onPress
}) => {
	const { theme } = useTheme();

	return (
		<Pressable
			style={checklistStyles.item}
			onPress={completed ? undefined : onPress}
			disabled={completed}
		>
			<View
				style={[
					checklistStyles.checkCircle,
					{
						borderColor: completed ? theme.text.secondary : theme.border.color,
						backgroundColor: completed ? theme.text.secondary : undefined
					}
				]}
			>
				{completed && (
					<Icon
						name={'check2'}
						size={12}
						strokeWidth={3}
						color={theme.text.invert}
					/>
				)}
			</View>

			<Spacer x={12} />
			<Typography style={{ fontSize: 15 }}>{label}</Typography>
		</Pressable>
	);
};

const checklistStyles = StyleSheet.create({
	container: {
		borderRadius: 12,
		paddingVertical: 4
	},
	item: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 10,
		paddingHorizontal: 12
	},
	checkCircle: {
		width: 20,
		height: 20,
		borderWidth: 2,
		borderRadius: 20,
		justifyContent: 'center',
		alignItems: 'center'
	}
});

export default Store;

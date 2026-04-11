import React from 'react';
import { Pressable, View, StyleSheet } from 'react-native';
import {
	Icon,
	Separator,
	Spacer,
	Typography,
	useTheme
} from '@habiti/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';

import { Store, Address } from '../../data/types';
import type {
	AppStackParamList,
	StoreStackParamList
} from '../../navigation/types';

interface OnboardingChecklistProps {
	store: Store;
	addresses: Address[];
}

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
			style={styles.item}
			onPress={completed ? undefined : onPress}
			disabled={completed}
		>
			<View
				style={{
					width: 20,
					height: 20,
					borderWidth: 2,
					borderRadius: 20,
					justifyContent: 'center',
					alignItems: 'center',
					borderColor: completed ? theme.text.secondary : theme.border.color,
					backgroundColor: completed ? theme.text.secondary : undefined
				}}
			>
				{completed && (
					<Icon
						name={'check2'}
						size={12}
						strokeWidth={3}
						color={theme.text.tertiary}
					/>
				)}
			</View>

			<Spacer x={12} />
			<Typography size='small'>{label}</Typography>
		</Pressable>
	);
};

const OnboardingChecklist: React.FC<OnboardingChecklistProps> = ({
	store,
	addresses
}) => {
	const { theme } = useTheme();
	const { navigate } =
		useNavigation<NavigationProp<AppStackParamList & StoreStackParamList>>();

	const items = [
		{
			label: 'Upload a store image',
			completed: !!store.image,
			onPress: () => navigate('Edit Store')
		},
		{
			label: 'Add at least one product',
			completed: store.products.length > 0,
			onPress: () => navigate('Modal.AddProduct')
		},
		{
			label: 'Add at least one address',
			completed: addresses.length > 0,
			onPress: () => navigate('Modal.AddAddress')
		},
		{
			label: 'Link a bank account',
			completed: !!store.bankAccountNumber,
			onPress: () => navigate('Modal.AddPayoutAccount')
		}
	];

	const completedCount = items.filter(i => i.completed).length;

	if (completedCount === items.length) {
		return null;
	}

	return (
		<View>
			<Typography weight='medium'>Finish setting up your store</Typography>

			<Spacer y={4} />

			<Typography variant='secondary' size='small'>
				{completedCount} of {items.length} completed
			</Typography>

			<Spacer y={8} />

			<View
				style={[styles.container, { backgroundColor: theme.input.background }]}
			>
				{items.map((item, index) => (
					<React.Fragment key={item.label}>
						<ChecklistItem
							label={item.label}
							completed={item.completed}
							onPress={item.onPress}
						/>
						{index !== items.length - 1 && <Separator />}
					</React.Fragment>
				))}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		borderRadius: 12,
		paddingVertical: 4
	},
	item: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 10,
		paddingHorizontal: 12
	}
});

export default OnboardingChecklist;

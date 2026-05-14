import React from 'react';
import {
	View,
	StyleSheet,
	ActivityIndicator,
	Alert,
	Pressable
} from 'react-native';
import { Icon, Screen, Typography, useTheme } from '@habiti/components';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { HeaderButton } from '@react-navigation/elements';

import { CardIconMap } from '../components/cart/CardIcons';

import { AppStackParamList } from '../navigation/types';
import { useCardsQuery } from '../data/queries';
import { useDeleteCardMutation } from '../data/mutations';
import { Card } from '../data/types';
import useStore from '../state';

const PaymentMethods = () => {
	const { data, isLoading } = useCardsQuery();
	const { navigate, setOptions } =
		useNavigation<NavigationProp<AppStackParamList>>();
	const [focusedCardId, setFocusedCardId] = React.useState<string>();
	const deleteCard = useDeleteCardMutation();
	const { defaultCard, setPreference } = useStore();

	const handleLongPress = React.useCallback((card: Card) => {
		setFocusedCardId(card.id);
	}, []);

	const handleCardPress = React.useCallback(
		(card: Card) => {
			if (focusedCardId === card.id) {
				setFocusedCardId(undefined);
			}
		},
		[focusedCardId]
	);

	const onDeleteCard = React.useCallback(
		(cardId: string) => {
			if (cardId === defaultCard) {
				setPreference({ defaultCard: null });
			}

			deleteCard.mutate(cardId);
		},
		[defaultCard, deleteCard, setPreference]
	);

	const handleDeleteCard = React.useCallback(
		(card: Card) => {
			Alert.alert('Delete Card', 'Are you sure you want to delete this card?', [
				{ text: 'Cancel', style: 'cancel' },
				{
					text: 'Delete',
					style: 'destructive',
					onPress: () => onDeleteCard(card.id)
				}
			]);
		},
		[deleteCard]
	);

	React.useLayoutEffect(() => {
		const handleAddCard = () =>
			navigate('Modal.AddCard', { orderId: undefined });

		setOptions({
			headerRight: () => (
				<HeaderButton onPress={handleAddCard}>
					<Icon name='plus' />
				</HeaderButton>
			),
			unstable_headerRightItems: () => [
				{
					type: 'button',
					label: 'Add',
					icon: { type: 'sfSymbol', name: 'plus' },
					onPress: handleAddCard
				}
			]
		});
	}, []);

	const cards = data?.cards;

	if (isLoading || !cards) {
		return (
			<View style={styles.loading}>
				<ActivityIndicator />
			</View>
		);
	}

	return (
		<Screen>
			{cards.map(card => (
				<CardRow
					key={card.id}
					card={card}
					onPress={() => handleCardPress(card)}
					onLongPress={() => handleLongPress(card)}
					focused={focusedCardId === card.id}
					onDelete={() => handleDeleteCard(card)}
				/>
			))}
		</Screen>
	);
};

interface CardRowProps {
	card: Card;
	onLongPress: () => void;
	onPress: () => void;
	focused: boolean;
	onDelete: () => void;
}

const CardRow: React.FC<CardRowProps> = ({
	card,
	onLongPress,
	onPress,
	focused,
	onDelete
}) => {
	const { theme } = useTheme();

	return (
		<Pressable
			style={[
				styles.card,
				{
					borderBottomColor: theme.border.color,
					backgroundColor: focused ? theme.row.focus : 'transparent'
				}
			]}
			onLongPress={onLongPress}
			onPress={onPress}
		>
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'space-between'
				}}
			>
				<View style={{ flexDirection: 'row', alignItems: 'center' }}>
					<View style={{ marginLeft: -10 }}>
						{CardIconMap[card.cardType.trim()]}
					</View>
					<Typography
						style={styles.capitalize}
					>{`\u2022\u2022\u2022\u2022${card.last4}`}</Typography>
				</View>
				{focused && (
					<Pressable
						style={{ flexDirection: 'row', alignItems: 'center' }}
						onPress={() => onDelete()}
					>
						<Icon name='trash' size={20} />
					</Pressable>
				)}
			</View>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	sectionHeader: {
		marginTop: 16,
		marginBottom: 8,
		marginLeft: 16
	},
	loading: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	card: {
		paddingVertical: 4,
		paddingHorizontal: 16,
		borderBottomWidth: StyleSheet.hairlineWidth
	},
	capitalize: {
		textTransform: 'capitalize'
	}
});

export default PaymentMethods;

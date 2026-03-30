import React from 'react';
import { View, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Icon, Screen } from '@habiti/components';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { HeaderButton } from '@react-navigation/elements';

import useGoBack from '../hooks/useGoBack';
import CardRow from '../components/payment-methods/CardRow';
import { AppStackParamList } from '../types/navigation';
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

	useGoBack();

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
		setOptions({
			headerRight: () => (
				<HeaderButton
					onPress={() => navigate('Modal.AddCard', { orderId: undefined })}
				>
					<Icon name='plus' />
				</HeaderButton>
			)
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
	}
});

export default PaymentMethods;

import React from 'react';
import {
	View,
	StyleSheet,
	ActivityIndicator,
	Pressable,
	Alert
} from 'react-native';
import { Icon, Screen } from '@habiti/components';
import { useNavigation, NavigationProp } from '@react-navigation/native';

import useGoBack from '../hooks/useGoBack';
import CardRow from '../components/payment-methods/CardRow';
import { AppStackParamList } from '../types/navigation';
import { CardsQuery, useCardsQuery, useDeleteCardMutation } from '../types/api';
import useStore from '../state';

const PaymentMethods: React.FC = () => {
	const [{ data, fetching }] = useCardsQuery();
	const { navigate, setOptions } =
		useNavigation<NavigationProp<AppStackParamList>>();
	const [focusedCardId, setFocusedCardId] = React.useState<string>();
	const [, deleteCard] = useDeleteCardMutation();
	const { defaultCard, setPreference } = useStore();

	useGoBack();

	const handleLongPress = React.useCallback(
		(card: CardsQuery['currentUser']['cards'][number]) => {
			setFocusedCardId(card.id);
		},
		[]
	);

	const handleCardPress = React.useCallback(
		(card: CardsQuery['currentUser']['cards'][number]) => {
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

			deleteCard({ id: cardId });
		},
		[defaultCard, deleteCard, setPreference]
	);

	const handleDeleteCard = React.useCallback(
		(card: CardsQuery['currentUser']['cards'][number]) => {
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
				<Pressable
					onPress={() => navigate('Modal.AddCard', { orderId: undefined })}
				>
					<Icon name='plus' />
				</Pressable>
			)
		});
	}, []);

	const cards = data?.currentUser.cards;

	if (fetching || !cards) {
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

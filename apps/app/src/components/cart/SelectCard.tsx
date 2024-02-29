import { Icon, Typography } from '@market/components';
import React from 'react';
import { View, Pressable, ActivityIndicator, StyleSheet } from 'react-native';

import { MastercardIcon } from './CardIcons';
import { useCardsQuery } from '../../types/api';

interface SelectCardProps {
	selectedCard: string | null;
	onCardSelect(cardId: string): () => void;
}

const SelectCard: React.FC<SelectCardProps> = ({
	selectedCard,
	onCardSelect
}) => {
	const [{ data, fetching }] = useCardsQuery();
	const [expanded, toggleExpanded] = React.useReducer(e => !e, false);

	const cards = data?.currentUser.cards ?? [];

	const displayCard = React.useMemo(() => {
		return cards.find(c => c.id === selectedCard) ?? cards[0];
	}, [selectedCard, cards]);

	if (fetching) {
		return (
			<View style={styles.loading}>
				<ActivityIndicator />
			</View>
		);
	}

	return (
		<View>
			<Pressable style={styles.row} onPress={toggleExpanded}>
				<View style={styles.cardInfo}>
					<Typography style={styles.cardText}>
						{!expanded
							? displayCard
								? `${displayCard.cardType} *${displayCard.last4}`
								: 'Add card'
							: ''}
					</Typography>
				</View>
				<Icon name='chevron-right' style={{ marginRight: -8 }} />
			</Pressable>

			{expanded && (
				<View>
					{cards.map(card => (
						<Pressable
							key={card.id}
							onPress={onCardSelect(card.id)}
							style={styles.row}
						>
							<MastercardIcon />
							<Typography style={{ textTransform: 'capitalize' }}>
								{card.cardType} *{card.last4}
							</Typography>
							{selectedCard === card.id && <Icon name='check' />}
						</Pressable>
					))}
				</View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	loading: {
		justifyContent: 'center',
		alignItems: 'center'
	},
	row: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	cardInfo: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	cardText: {
		fontSize: 16,
		marginHorizontal: 8,
		textTransform: 'capitalize'
	},
	modal: {
		paddingHorizontal: 16,
		paddingTop: 8,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 4
		},
		shadowOpacity: 0.3,
		shadowRadius: 4.65,

		elevation: 8
	},
	modalBackground: {
		backgroundColor: '#FFFFFF'
	},
	title: {
		fontSize: 18,
		fontWeight: '500'
	}
});

export default SelectCard;

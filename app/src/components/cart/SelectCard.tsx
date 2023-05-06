import React from 'react';
import {
	View,
	Text,
	Pressable,
	ActivityIndicator,
	StyleSheet
} from 'react-native';
import { useCardsQuery } from '../../types/api';
import { Icon } from '../Icon';
import { MastercardIcon } from './CardIcons';

interface SelectCardProps {
	selectedCard: string | null;
	onCardSelect(cardId: string): () => void;
}

const SelectCard: React.FC<SelectCardProps> = ({
	selectedCard,
	onCardSelect
}) => {
	const [{ data, fetching }] = useCardsQuery();
	const [expanded, setExpanded] = React.useState(false);

	const cards = data?.currentUser.cards;

	const toggleExpanded = React.useCallback(() => {
		setExpanded(e => !e);
	}, []);

	const displayCard = React.useMemo(() => {
		return cards?.find(c => c.id === selectedCard) ?? cards?.[0];
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
					<Text style={styles.cardText}>
						{!expanded
							? displayCard
								? `${displayCard.cardType} *${displayCard.last4}`
								: 'Add card'
							: ''}
					</Text>
				</View>
				<Icon name='chevron-right' style={{ marginRight: -8 }} />
			</Pressable>

			{expanded && (
				<View>
					{cards?.map(card => (
						<Pressable
							key={card.id}
							onPress={onCardSelect(card.id)}
							style={styles.row}
						>
							<MastercardIcon />
							<Text style={{ textTransform: 'capitalize' }}>
								{card.cardType} *{card.last4}
							</Text>
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

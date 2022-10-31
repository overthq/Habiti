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
					<MastercardIcon />
					<Text style={styles.cardText}>
						{displayCard ? `···· ${displayCard.last4}` : ' Add card'}
					</Text>
					<Icon name='chevron-right' style={{ marginRight: -8 }} />
				</View>
			</Pressable>

			{expanded && (
				<View>
					{cards?.map(card => (
						<Pressable
							key={card.id}
							onPress={onCardSelect(card.id)}
							style={styles.row}
						>
							<Text>Ending in {card.last4}</Text>
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
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	cardInfo: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between'
	},
	cardText: {
		fontSize: 16,
		marginHorizontal: 8
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

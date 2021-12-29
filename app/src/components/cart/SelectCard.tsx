import React from 'react';
import {
	View,
	Text,
	Pressable,
	ActivityIndicator,
	StyleSheet
} from 'react-native';
import { useCardsQuery } from '../../types/api';

interface SelectCardProps {
	handleCardSelect(cardId: string): void;
}

const SelectCard: React.FC<SelectCardProps> = ({ handleCardSelect }) => {
	const [{ data, fetching }] = useCardsQuery();
	const cards = data?.currentUser.cards;

	if (fetching) {
		return (
			<View style={styles.loading}>
				<ActivityIndicator />
			</View>
		);
	}

	return (
		<View style={styles.container}>
			{cards?.map(card => (
				<Pressable key={card.id} onPress={() => handleCardSelect(card.id)}>
					<Text>**** {card.last4}</Text>
				</Pressable>
			))}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {},
	loading: {
		justifyContent: 'center',
		alignItems: 'center'
	}
});

export default SelectCard;

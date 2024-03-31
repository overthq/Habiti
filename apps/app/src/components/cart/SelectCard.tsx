import { Icon, Spacer, Typography, useTheme } from '@market/components';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { MastercardIcon } from './CardIcons';
import { CartQuery } from '../../types/api';

interface SelectCardProps {
	cards: CartQuery['cart']['user']['cards'];
	selectedCard?: string;
	onCardSelect(cardId: string): () => void;
}

const SelectCard: React.FC<SelectCardProps> = ({
	cards,
	selectedCard,
	onCardSelect
}) => {
	const { theme } = useTheme();

	return (
		<Animated.View>
			<View
				style={{
					borderBottomWidth: 0.5,
					borderBottomColor: theme.border.color
				}}
			/>
			{cards.map(card => (
				<SelectCardOption
					key={card.id}
					card={card}
					onSelect={onCardSelect}
					selected={selectedCard === card.id}
				/>
			))}
		</Animated.View>
	);
};

interface SelectCardOptionProps {
	card: CartQuery['cart']['user']['cards'][number];
	onSelect(cardId: string): () => void;
	selected: boolean;
}

const SelectCardOption: React.FC<SelectCardOptionProps> = ({
	card,
	onSelect,
	selected
}) => {
	const { theme } = useTheme();

	return (
		<Pressable
			style={[styles.option, { borderBottomColor: theme.border.color }]}
			onPress={onSelect(card.id)}
		>
			<View style={{ flexDirection: 'row', alignItems: 'center' }}>
				<MastercardIcon />
				<Spacer x={4} />
				<Typography style={styles.capitalize}>
					{`${card.cardType} \u2022\u2022\u2022\u2022${card.last4}`}
				</Typography>
			</View>
			{selected ? <Icon name='check' /> : null}
		</Pressable>
	);
};

const styles = StyleSheet.create({
	option: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 4,
		paddingHorizontal: 16,
		borderBottomWidth: 0.5
	},
	capitalize: {
		textTransform: 'capitalize'
	}
});

export default SelectCard;

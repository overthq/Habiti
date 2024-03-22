import { AnimatedTypography, Spacer } from '@market/components';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';

import { MastercardIcon } from './CardIcons';
import { CartQuery } from '../../types/api';

interface SelectCardProps {
	cards: CartQuery['cart']['user']['cards'];
	selectedCard?: string;
	onCardSelect(cardId: string): void;
}

const SelectCard: React.FC<SelectCardProps> = ({
	cards,
	selectedCard,
	onCardSelect
}) => {
	return (
		<Animated.View>
			{cards.map(card => (
				<SelectCardOption
					key={card.id}
					card={card}
					onPress={() => onCardSelect(card.id)}
					selected={selectedCard === card.id}
				/>
			))}
		</Animated.View>
	);
};

interface SelectCardOptionProps {
	card: CartQuery['cart']['user']['cards'][number];
	onPress(): void;
	selected: boolean;
}

const SelectCardOption: React.FC<SelectCardOptionProps> = ({
	card,
	onPress,
	selected
}) => {
	return (
		<Pressable onPress={onPress}>
			<Animated.View style={styles.option}>
				<MastercardIcon />
				<Spacer x={8} />
				<AnimatedTypography>
					{card.cardType} *{card.last4}
				</AnimatedTypography>
			</Animated.View>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	option: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 8,
		borderRadius: 4,
		borderWidth: 1
	}
});

export default SelectCard;

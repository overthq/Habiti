import { SelectGroup, Spacer, Typography } from '@market/components';
import React from 'react';
import { View } from 'react-native';

// import { MastercardIcon } from './CardIcons';
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
		<View style={{ paddingHorizontal: 16 }}>
			<Typography weight='medium' variant='secondary'>
				Payment Method
			</Typography>
			<Spacer y={8} />
			<SelectGroup
				selected={selectedCard}
				options={cards.map(card => ({
					title: `${card.cardType} \u2022\u2022\u2022\u2022${card.last4}`,
					value: card.id
				}))}
				onSelect={onCardSelect}
				capitalize
			/>
		</View>
	);
};

export default SelectCard;

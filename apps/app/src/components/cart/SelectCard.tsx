import React from 'react';
import { View } from 'react-native';
import { SelectGroup, Spacer, Typography, useTheme } from '@habiti/components';

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
	const { theme } = useTheme();

	return (
		<View style={{ paddingHorizontal: 16 }}>
			<Typography weight='medium' variant='secondary'>
				Payment Method
			</Typography>
			<Spacer y={8} />
			{cards.length === 0 ? (
				<View
					style={{
						backgroundColor: theme.input.background,
						padding: 12,
						borderRadius: 6
					}}
				>
					<Typography weight='medium' size='large'>
						No payment methods
					</Typography>
					<Spacer y={4} />
					<Typography variant='secondary'>
						You will be prompted to add a payment method when you place this
						order.
					</Typography>
				</View>
			) : (
				<SelectGroup
					selected={selectedCard}
					options={cards.map(card => ({
						title: `${card.cardType} \u2022\u2022\u2022\u2022${card.last4}`,
						value: card.id
					}))}
					onSelect={onCardSelect}
					capitalize
				/>
			)}
		</View>
	);
};

export default SelectCard;

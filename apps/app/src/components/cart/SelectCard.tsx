import {
	SelectGroup,
	Spacer,
	TextButton,
	Typography,
	useTheme
} from '@habiti/components';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import React from 'react';
import { View } from 'react-native';

// import { MastercardIcon } from './CardIcons';
import { CartQuery } from '../../types/api';
import { AppStackParamList } from '../../types/navigation';

interface SelectCardProps {
	cards: CartQuery['cart']['user']['cards'];
	selectedCard?: string;
	onCardSelect(cardId: string): void;
}

// FIXME: I have to standardize this empty state component across the app.

const SelectCard: React.FC<SelectCardProps> = ({
	cards,
	selectedCard,
	onCardSelect
}) => {
	const { theme } = useTheme();
	const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();

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
						A valid payment method is required to create your order.
					</Typography>
					<Spacer y={8} />
					<View style={{ backgroundColor: theme.border.color, height: 1 }} />
					<Spacer y={8} />
					<TextButton onPress={() => navigate('Add Card')}>
						Add payment method
					</TextButton>
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

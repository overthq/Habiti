import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Icon, Typography, useTheme } from '@habiti/components';

import { CardsQuery } from '../../types/api';
import { CardIconMap } from '../cart/CardIcons';

interface CardRowProps {
	card: CardsQuery['currentUser']['cards'][number];
	onLongPress: () => void;
	onPress: () => void;
	focused: boolean;
	onDelete: () => void;
}

const CardRow: React.FC<CardRowProps> = ({
	card,
	onLongPress,
	onPress,
	focused,
	onDelete
}) => {
	const { theme } = useTheme();

	return (
		<Pressable
			style={[
				styles.card,
				{
					borderBottomColor: theme.border.color,
					backgroundColor: focused ? theme.row.focus : 'transparent'
				}
			]}
			onLongPress={onLongPress}
			onPress={onPress}
		>
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'space-between'
				}}
			>
				<View style={{ flexDirection: 'row', alignItems: 'center' }}>
					<View style={{ marginLeft: -10 }}>
						{CardIconMap[card.cardType.trim()]}
					</View>
					<Typography
						style={styles.capitalize}
					>{`\u2022\u2022\u2022\u2022${card.last4}`}</Typography>
				</View>
				{focused && (
					<Pressable
						style={{ flexDirection: 'row', alignItems: 'center' }}
						onPress={() => onDelete()}
					>
						<Icon name='trash' size={20} />
					</Pressable>
				)}
			</View>
		</Pressable>
	);
};

export default CardRow;

const styles = StyleSheet.create({
	card: {
		paddingVertical: 4,
		paddingHorizontal: 16,
		borderBottomWidth: 0.5
	},
	capitalize: {
		textTransform: 'capitalize'
	}
});

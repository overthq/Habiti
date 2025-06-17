import React from 'react';
import { Pressable, View, StyleSheet } from 'react-native';
import { formatNaira } from '@habiti/common';
import { Spacer, Typography, useTheme } from '@habiti/components';

interface ProductPriceProps {
	value: number;
	onPress: () => void;
}

const ProductPrice: React.FC<ProductPriceProps> = ({ value, onPress }) => {
	const { theme } = useTheme();

	const formatValue = React.useCallback((value: string) => {
		return formatNaira(value ? Number(value) : 0);
	}, []);

	return (
		<View style={{ paddingHorizontal: 16 }}>
			<View style={styles.header}>
				<Typography weight='medium' size='xlarge'>
					Price
				</Typography>
			</View>
			<Spacer y={4} />
			<Pressable
				style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}
				onPress={onPress}
			>
				<Typography size='xxlarge' style={{ color: theme.text.primary }}>
					{formatValue(value.toString())}
				</Typography>
				<View
					style={[styles.editButton, { backgroundColor: theme.text.primary }]}
				>
					<Typography variant='invert' size='small'>
						Edit
					</Typography>
				</View>
			</Pressable>
		</View>
	);
};

const styles = StyleSheet.create({
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	editButton: {
		borderRadius: 100,
		paddingVertical: 4,
		paddingHorizontal: 8
	}
});

export default ProductPrice;

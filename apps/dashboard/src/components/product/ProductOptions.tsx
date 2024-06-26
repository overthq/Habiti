import { Spacer, TextButton, Typography, useTheme } from '@habiti/components';
import React from 'react';
import { View, StyleSheet } from 'react-native';

import { ProductQuery } from '../../types/api';

interface ProductOptionsProps {
	options?: ProductQuery['product']['options'];
}

const NoProductOptions = () => {
	const { theme } = useTheme();

	return (
		<View
			style={{
				backgroundColor: theme.input.background,
				padding: 12,
				borderRadius: 6,
				marginVertical: 8
			}}
		>
			<Typography weight='medium' size='large'>
				No product options
			</Typography>
			<Spacer y={4} />
			<Typography variant='secondary'>
				There are currently no options for this product. When you create
				options, they will appear here.
			</Typography>
			<Spacer y={8} />
			<View style={{ backgroundColor: theme.border.color, height: 1 }} />
			<Spacer y={8} />
			<TextButton>Add product option</TextButton>
		</View>
	);
};

const ProductOptions: React.FC<ProductOptionsProps> = ({ options }) => {
	return (
		<View style={styles.container}>
			<Typography weight='medium' variant='label'>
				Options
			</Typography>
			<View>{options?.length === 0 ? <NoProductOptions /> : <View />}</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingVertical: 8,
		paddingHorizontal: 16
	}
});

export default ProductOptions;

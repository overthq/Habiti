import { CustomImage, Typography } from '@market/components';
import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';

const RelatedProducts = () => {
	return (
		<View style={styles.container}>
			<Typography variant='label' weight='medium' style={{ marginBottom: 4 }}>
				Related products
			</Typography>
			<ScrollView horizontal showsHorizontalScrollIndicator={false}>
				{Array(5)
					.fill(0)
					.map(() => (
						<View style={{ marginRight: 8 }}>
							<CustomImage height={120} width={120} />
						</View>
					))}
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 16,
		paddingTop: 16
	}
});

export default RelatedProducts;

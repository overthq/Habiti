import { CustomImage, Typography } from '@market/components';
import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';

const RelatedProducts = () => {
	return (
		<View style={styles.container}>
			<Typography
				variant='label'
				weight='medium'
				style={{ marginBottom: 4, marginLeft: 16 }}
			>
				Related products
			</Typography>
			<ScrollView
				// style={styles.scroll}
				contentContainerStyle={styles.scroll}
				horizontal
				showsHorizontalScrollIndicator={false}
			>
				{Array(5)
					.fill(0)
					.map(() => (
						<View style={{ marginLeft: 8 }}>
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
		paddingTop: 16
	},
	scroll: {
		paddingLeft: 8,
		paddingRight: 16
	}
});

export default RelatedProducts;

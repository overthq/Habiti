import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Typography from '../global/Typography';

const SortProducts = () => {
	return (
		<View style={{ marginTop: 8 }}>
			<Pressable style={styles.option}>
				<Typography>Default</Typography>
			</Pressable>
			<Pressable style={styles.option}>
				<Typography>Newest</Typography>
			</Pressable>
			<Pressable style={styles.option}>
				<Typography>Highest to lowest price</Typography>
			</Pressable>
			<Pressable style={styles.option}>
				<Typography>Lowest to highest price</Typography>
			</Pressable>
		</View>
	);
};

const styles = StyleSheet.create({
	option: {
		marginBottom: 4
	}
});

export default SortProducts;

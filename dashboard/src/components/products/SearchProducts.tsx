import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SearchProducts = () => {
	return (
		<SafeAreaView style={styles.container}>
			<View>
				<TextInput />
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});

export default SearchProducts;

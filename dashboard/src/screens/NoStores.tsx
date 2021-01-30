import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const NoStores: React.FC = () => {
	const { navigate } = useNavigation();

	return (
		<View style={styles.container}>
			<Text>{`Looks like you don't have access to any stores. Create one?`}</Text>
			<TouchableOpacity onPress={() => navigate('CreateStore')}>
				<Text>Create Store</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});

export default NoStores;

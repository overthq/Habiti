import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { AppStackParamList } from '../types/navigation';

const NoStores: React.FC = () => {
	const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();

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

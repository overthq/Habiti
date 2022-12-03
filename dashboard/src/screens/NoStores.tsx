import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { AppStackParamList } from '../types/navigation';
import Button from '../components/global/Button';

const NoStores: React.FC = () => {
	const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();

	return (
		<View style={styles.container}>
			<Text>{`Looks like you don't have access to any stores. Create one?`}</Text>
			<Button onPress={() => navigate('CreateStore')} text='Create Store' />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});

export default NoStores;

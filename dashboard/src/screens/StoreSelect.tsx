import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StoresList from '../components/store-select/StoresList';
import { AppStackParamList } from '../types/navigation';
import Button from '../components/global/Button';

const StoreSelect: React.FC = () => {
	const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();

	return (
		<SafeAreaView style={styles.container}>
			<Text style={styles.header}>Select store</Text>
			<Text style={{ fontSize: 17 }}>
				Kindly select a store you manage, or create a new one:
			</Text>
			<StoresList />
			<Button
				onPress={() => navigate('CreateStore')}
				style={{ marginBottom: 16 }}
				text='Create a store'
			/>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 16,
		backgroundColor: '#FFFFFF'
	},
	header: {
		fontWeight: 'bold',
		fontSize: 34,
		marginBottom: 8
	}
});

export default StoreSelect;

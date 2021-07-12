import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StoresList from '../components/store-select/StoresList';

const StoreSelect: React.FC = () => {
	const { navigate } = useNavigation();

	return (
		<SafeAreaView style={styles.container}>
			<Text style={styles.header}>Select store</Text>
			<Text style={{ fontSize: 17 }}>
				Kindly select a store you manage, or create a new one:
			</Text>
			<StoresList />
			<TouchableOpacity
				onPress={() => navigate('CreateStore')}
				style={{ alignSelf: 'center', marginBottom: 16 }}
			>
				<Text>Create a store</Text>
			</TouchableOpacity>
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

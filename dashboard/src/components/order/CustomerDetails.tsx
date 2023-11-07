import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { AppStackParamList } from '../../types/navigation';
import { OrderQuery } from '../../types/api';

interface CustomerDetailProps {
	user: OrderQuery['order']['user'];
}

const CustomerDetails: React.FC<CustomerDetailProps> = ({ user }) => {
	const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();

	const handlePress = React.useCallback(() => {
		navigate('CustomerInfo', { userId: user.id });
	}, []);

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Customer Details</Text>
			<Pressable onPress={handlePress}>
				<Text style={styles.name}>{user.name}</Text>
			</Pressable>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 16,
		paddingBottom: 16
	},
	title: {
		fontSize: 16,
		fontWeight: '500'
	},
	name: {
		fontSize: 16
	}
});

export default CustomerDetails;

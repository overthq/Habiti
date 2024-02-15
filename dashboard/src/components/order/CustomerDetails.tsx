import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { AppStackParamList } from '../../types/navigation';
import { OrderQuery } from '../../types/api';
import Typography from '../global/Typography';

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
			<Typography weight='medium'>Customer Details</Typography>
			<Pressable onPress={handlePress}>
				<Typography>{user.name}</Typography>
			</Pressable>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 16
	}
});

export default CustomerDetails;

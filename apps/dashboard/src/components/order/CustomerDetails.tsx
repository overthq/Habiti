import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Avatar, Spacer, Typography, useTheme } from '@habiti/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';

import { OrdersStackParamList } from '../../navigation/types';
import { User } from '../../data/types';

interface CustomerDetailProps {
	user: User;
}

const CustomerDetails: React.FC<CustomerDetailProps> = ({ user }) => {
	const { navigate } = useNavigation<NavigationProp<OrdersStackParamList>>();
	const { theme } = useTheme();

	const handlePress = React.useCallback(() => {
		navigate('CustomerInfo', { userId: user.id });
	}, [user.id]);

	return (
		<View style={styles.container}>
			<Typography weight='medium'>Customer</Typography>
			<Spacer y={8} />
			<Pressable
				onPress={handlePress}
				style={[styles.button, { backgroundColor: theme.input.background }]}
			>
				<View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
					<Avatar fallbackText={user.name} />
					<Typography>{user.name}</Typography>
				</View>
				{/*<Separator
					style={{ marginVertical: 8, marginHorizontal: -12 }}
					inset={false}
				/>
				<TextButton onPress={() => {}}>View order history</TextButton>*/}
			</Pressable>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 16
	},
	button: {
		paddingHorizontal: 12,
		paddingVertical: 10,
		borderRadius: 12
	}
});

export default CustomerDetails;

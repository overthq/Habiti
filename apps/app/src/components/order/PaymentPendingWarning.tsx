import { NavigationProp, useNavigation } from '@react-navigation/native';
import { OrderStatus, useUpdateOrderMutation } from '../../types/api';
import { AppStackParamList } from '../../types/navigation';
import { StyleSheet, View } from 'react-native';
import { Button, Spacer, Typography, useTheme } from '@habiti/components';

interface PaymentPendingWarningProps {
	orderId: string;
}

const PaymentPendingWarning: React.FC<PaymentPendingWarningProps> = ({
	orderId
}) => {
	const { theme } = useTheme();
	const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();
	const [, updateOrder] = useUpdateOrderMutation();

	const handleMakePayment = () => {
		navigate('Add Card', { orderId });
	};

	const handleCancelOrder = () => {
		updateOrder({
			orderId,
			input: { status: OrderStatus.Cancelled }
		});
	};

	return (
		<View
			style={[styles.container, { backgroundColor: theme.input.background }]}
		>
			<Typography weight='medium'>Payment pending</Typography>
			<Spacer y={4} />
			<Typography variant='secondary' size='small'>
				This order has a pending payment. Please make the payment to complete
				your order.
			</Typography>
			<Spacer y={12} />
			<View style={{ flexDirection: 'row', gap: 8 }}>
				<Button
					style={{ flex: 1 }}
					text='Make Payment'
					variant='primary'
					size='small'
					onPress={handleMakePayment}
				/>
				<Button
					style={{ flex: 1 }}
					text='Cancel Order'
					variant='destructive'
					size='small'
					onPress={handleCancelOrder}
				/>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginBottom: 12,
		marginHorizontal: 16,
		padding: 12,
		borderRadius: 8
	}
});

export default PaymentPendingWarning;

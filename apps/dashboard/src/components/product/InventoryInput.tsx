import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { useTheme, Typography, Spacer } from '@habiti/components';

interface InventoryInputProps {
	onPress: () => void;
	quantity: number;
}

const InventoryInput: React.FC<InventoryInputProps> = ({
	onPress,
	quantity
}) => {
	return (
		<View style={styles.container}>
			<Typography weight='semibold' size='large'>
				Inventory
			</Typography>
			<Spacer y={4} />
			<View style={styles.right}>
				<Pressable onPress={onPress}>
					<Typography size='xlarge'>{quantity}</Typography>
				</Pressable>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 16
	},
	right: {
		flexDirection: 'row',
		alignItems: 'center'
	}
});

export default InventoryInput;

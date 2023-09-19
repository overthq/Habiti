import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Icon } from '../Icon';
import type { StoreStackParamList } from '../../types/navigation';

interface StoreMenuRowProps {
	title: string;
	onPress(): void;
}

const StoreMenuRow: React.FC<StoreMenuRowProps> = ({ title, onPress }) => {
	return (
		<Pressable style={styles.menuButton} onPress={onPress}>
			<Text style={styles.menuButtonText}>{title}</Text>
			<Icon name='chevron-right' color='#505050' />
		</Pressable>
	);
};

const StoreMenu = () => {
	const { navigate } = useNavigation<NavigationProp<StoreStackParamList>>();

	const handleNavigate = React.useCallback(
		(screen: keyof StoreStackParamList) => () => {
			navigate(screen);
		},
		[]
	);

	return (
		<View style={styles.container}>
			<StoreMenuRow
				title='Edit profile'
				onPress={handleNavigate('Edit Store')}
			/>
			<StoreMenuRow title='Payouts' onPress={handleNavigate('Payouts')} />
			<StoreMenuRow title='Managers' onPress={handleNavigate('Managers')} />
			<StoreMenuRow title='Categories' onPress={handleNavigate('Categories')} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#FFFFFF'
	},
	menuButton: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 16,
		paddingVertical: 8
	},
	menuButtonText: {
		fontSize: 16
	}
});

export default StoreMenu;

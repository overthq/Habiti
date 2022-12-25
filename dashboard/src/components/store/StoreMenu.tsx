import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Icon } from '../Icon';
import type { StoreStackParamList } from '../../types/navigation';

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
			<Pressable
				style={styles.menuButton}
				onPress={handleNavigate('Edit Store')}
			>
				<Text style={styles.menuButtonText}>Edit store profile</Text>
				<Icon name='chevron-right' color='#505050' />
			</Pressable>
			<Pressable style={styles.menuButton} onPress={handleNavigate('Managers')}>
				<Text style={styles.menuButtonText}>Managers</Text>
				<Icon name='chevron-right' color='#505050' />
			</Pressable>
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
		paddingHorizontal: 16,
		paddingVertical: 8
	},
	menuButtonText: {
		fontSize: 16
	}
});

export default StoreMenu;

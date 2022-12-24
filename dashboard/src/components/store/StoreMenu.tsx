import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';

import type { StoreStackParamList } from '../../types/navigation';

const StoreMenu = () => {
	const { navigate } = useNavigation<NavigationProp<StoreStackParamList>>();

	return (
		<View style={styles.container}>
			<Pressable onPress={() => navigate('Managers')}>
				<Text>Managers</Text>
			</Pressable>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		borderRadius: 4,
		backgroundColor: '#FFFFFF'
	}
});

export default StoreMenu;

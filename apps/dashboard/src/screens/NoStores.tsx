import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Typography } from '@habiti/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';

import { AppStackParamList } from '../navigation/types';

const NoStores: React.FC = () => {
	const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();

	return (
		<View style={styles.container}>
			<Typography>{`Looks like you don't have access to any stores. Create one?`}</Typography>
			<Button
				onPress={() => navigate('Modal.CreateStore')}
				text='Create Store'
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});

export default NoStores;

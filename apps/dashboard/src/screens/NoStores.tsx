import React from 'react';
import { View, StyleSheet, Linking } from 'react-native';
import { Button, Typography } from '@habiti/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';

import { AppStackParamList } from '../navigation/types';
import { STORE_CREATION_ENABLED } from '../utils/constants';
import env from '../../env';

const NoStores: React.FC = () => {
	const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();

	if (!STORE_CREATION_ENABLED) {
		return (
			<View style={styles.container}>
				<Typography>{`Looks like you don't have access to any stores. Create one on habiti.com/sell.`}</Typography>
				<Button
					text='Open habiti.com/sell'
					onPress={() => Linking.openURL(`${env.webFrontendUrl}/sell`)}
				/>
			</View>
		);
	}

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

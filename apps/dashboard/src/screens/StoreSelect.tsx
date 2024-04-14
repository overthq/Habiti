import { Button, Screen, Typography } from '@market/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import StoreSelectList from '../components/store-select/StoreSelectList';
import { AppStackParamList } from '../types/navigation';

const StoreSelect: React.FC = () => {
	const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();

	return (
		<Screen style={styles.container}>
			<SafeAreaView>
				<Typography size='xxlarge' weight='bold' style={styles.header}>
					Select store
				</Typography>

				<Typography style={styles.description}>
					You can choose an existing store you manage, or create a new one:
				</Typography>
				<StoreSelectList />
				<Button
					onPress={() => navigate('CreateStore')}
					style={{ marginBottom: 16 }}
					text='Create a store'
				/>
			</SafeAreaView>
		</Screen>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 16
	},
	header: {
		marginBottom: 8
	},
	description: {
		marginBottom: 16
	}
});

export default StoreSelect;

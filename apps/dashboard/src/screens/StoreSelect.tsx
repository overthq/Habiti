import { Button, Screen, Spacer, Typography } from '@habiti/components';
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
				<Typography size='xxxlarge' weight='bold'>
					Select store
				</Typography>

				<Spacer y={2} />

				<Typography variant='secondary'>
					You can choose an existing store you manage, or create a new one.
				</Typography>

				<Spacer y={16} />

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
		paddingHorizontal: 16,
		paddingTop: 32
	}
});

export default StoreSelect;

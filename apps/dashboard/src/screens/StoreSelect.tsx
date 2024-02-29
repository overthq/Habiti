import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import StoreSelectList from '../components/store-select/StoreSelectList';
import { AppStackParamList } from '../types/navigation';
import Button from '../components/global/Button';
import Screen from '../components/global/Screen';
import Typography from '../components/global/Typography';
import { SafeAreaView } from 'react-native-safe-area-context';

const StoreSelect: React.FC = () => {
	const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();

	return (
		<SafeAreaView>
			<Screen style={styles.container}>
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
			</Screen>
		</SafeAreaView>
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

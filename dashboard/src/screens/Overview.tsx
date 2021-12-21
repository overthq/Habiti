import React from 'react';
import { ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Icon } from '../components/icons';
import { ModalStackParamList } from '../types/navigation';

const Overview: React.FC = () => {
	const { navigate } = useNavigation<NavigationProp<ModalStackParamList>>();

	return (
		<ScrollView style={styles.container}>
			<TouchableOpacity onPress={() => navigate('SettingsStack')}>
				<Icon name='settings' />
			</TouchableOpacity>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 16,
		paddingHorizontal: 16
	}
});

export default Overview;

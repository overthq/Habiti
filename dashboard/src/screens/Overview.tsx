import React from 'react';
import { ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Icon } from '../components/Icon';
import { AppStackParamList } from '../types/navigation';

const Overview: React.FC = () => {
	const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();

	return (
		<ScrollView style={styles.container}>
			<TouchableOpacity onPress={() => navigate('Settings')}>
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

import { Icon } from '@market/components';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

const CloseButton: React.FC = () => {
	const { goBack } = useNavigation();

	return (
		<Pressable style={styles.container} onPress={() => goBack()}>
			<Icon name='x' />
		</Pressable>
	);
};

const styles = StyleSheet.create({
	container: {
		height: 32,
		width: 32,
		backgroundColor: '#FFFFFF',
		borderRadius: 16,
		position: 'absolute',
		top: 16,
		left: 16,
		justifyContent: 'center',
		alignItems: 'center'
	}
});

export default CloseButton;

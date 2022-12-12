import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Icon } from '../Icon';
import { StoreQuery } from '../../types/api';
import { AppStackParamList } from '../../types/navigation';

interface StoreProfileProps {
	store: StoreQuery['store'];
}

const StoreProfile: React.FC<StoreProfileProps> = ({ store }) => {
	const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();

	const navigateToEdit = React.useCallback(() => {
		navigate('Edit Store');
	}, []);

	return (
		<Pressable style={styles.container} onPress={navigateToEdit}>
			<View style={styles.left}>
				<View style={styles.avatar}>
					<Text style={styles.avatarText}>{store.name[0]}</Text>
				</View>
				<View>
					<Text style={styles.name}>{store.name}</Text>
					<Text style={styles.edit}>Edit store profile</Text>
				</View>
			</View>
			<Icon name='chevron-right' />
		</Pressable>
	);
};

const styles = StyleSheet.create({
	container: {
		width: '100%',
		backgroundColor: '#FFFFFF',
		borderRadius: 4,
		marginVertical: 16,
		padding: 8,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	left: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	avatar: {
		height: 40,
		width: 40,
		borderRadius: 20,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#505050',
		marginRight: 8
	},
	avatarText: {
		fontSize: 20,
		fontWeight: '500',
		color: '#D3D3D3'
	},
	name: {
		fontSize: 16,
		fontWeight: '500'
	},
	edit: {
		fontSize: 14,
		color: '#505050'
	}
});

export default StoreProfile;

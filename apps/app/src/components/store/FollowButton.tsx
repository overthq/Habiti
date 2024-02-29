import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Icon } from '../Icon';
import {
	useFollowStoreMutation,
	useUnfollowStoreMutation
} from '../../types/api';

interface FollowButtonProps {
	storeId: string;
	followed: boolean;
}

const FollowButton: React.FC<FollowButtonProps> = ({ storeId, followed }) => {
	const [, followStore] = useFollowStoreMutation();
	const [, unfollowStore] = useUnfollowStoreMutation();

	const handlePress = React.useCallback(async () => {
		if (followed) {
			await unfollowStore({ storeId });
		} else {
			await followStore({ storeId });
		}
	}, [followed]);

	return (
		<TouchableOpacity
			style={styles.container}
			activeOpacity={0.8}
			onPress={handlePress}
		>
			<Icon size={18} style={styles.icon} name={followed ? 'check' : 'plus'} />
			<Text style={styles.text}>{followed ? 'Following' : 'Follow'}</Text>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	container: {
		flexGrow: 1,
		paddingVertical: 4,
		marginLeft: 8,
		borderWidth: 1,
		borderColor: '#D3D3D3',
		borderRadius: 4,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},
	icon: {
		marginRight: 4
	},
	text: {
		fontSize: 16,
		fontWeight: '500'
	}
});

export default FollowButton;

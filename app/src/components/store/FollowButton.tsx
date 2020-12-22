import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Icon } from '../icons';

interface FollowButtonProps {
	isFollowing: boolean;
	follow(): void;
	unfollow(): void;
}

const FollowButton: React.FC<FollowButtonProps> = ({
	isFollowing,
	follow,
	unfollow
}) => (
	<TouchableOpacity
		style={styles.container}
		activeOpacity={0.8}
		onPress={isFollowing ? unfollow : follow}
	>
		<Icon
			size={20}
			style={{ marginRight: 5 }}
			name={isFollowing ? 'check' : 'plus'}
		/>
		<Text style={{ fontSize: 16, fontWeight: '500' }}>
			{isFollowing ? 'Following' : 'Follow'}
		</Text>
	</TouchableOpacity>
);

const styles = StyleSheet.create({
	container: {
		marginTop: 10,
		width: '100%',
		height: 35,
		borderWidth: 1,
		borderColor: '#D3D3D3',
		borderRadius: 4,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	}
});

export default FollowButton;

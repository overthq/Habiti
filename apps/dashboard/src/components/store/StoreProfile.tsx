import { Typography, useTheme } from '@habiti/components';
import React from 'react';
import { View, StyleSheet } from 'react-native';

import { StoreQuery } from '../../types/api';

interface StoreProfileProps {
	store: StoreQuery['currentStore'];
}

const StoreProfile: React.FC<StoreProfileProps> = ({ store }) => {
	const { theme } = useTheme();

	return (
		<View style={styles.container}>
			<View
				style={[styles.avatar, { backgroundColor: theme.image.placeholder }]}
			>
				<Typography weight='medium' size='xxxlarge' style={styles.avatarText}>
					{store.name[0]}
				</Typography>
			</View>
			<Typography weight='medium' size='xxlarge' style={styles.name}>
				{store.name}
			</Typography>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginVertical: 16,
		alignItems: 'center'
	},
	avatar: {
		height: 80,
		width: 80,
		borderRadius: 40,
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 8
	},
	avatarText: {
		color: '#505050'
	},
	name: {
		marginTop: 4,
		textAlign: 'center'
	}
});

export default StoreProfile;

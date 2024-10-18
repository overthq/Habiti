import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Typography, useTheme } from '@habiti/components';
import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';

import StoreSelectModal from './StoreSelectModal';
import { StoreQuery } from '../../types/api';

interface StoreProfileProps {
	store: StoreQuery['currentStore'];
}

const StoreProfile: React.FC<StoreProfileProps> = ({ store }) => {
	const { theme } = useTheme();
	const modalRef = React.useRef<BottomSheetModal>(null);

	return (
		<View style={styles.container}>
			<Pressable
				style={[styles.avatar, { backgroundColor: theme.image.placeholder }]}
				onPress={() => modalRef.current?.present()}
			>
				<Typography weight='medium' size='xxxlarge' style={styles.avatarText}>
					{store.name[0]}
				</Typography>
			</Pressable>
			<Typography weight='medium' size='xxlarge' style={styles.name}>
				{store.name}
			</Typography>
			<StoreSelectModal modalRef={modalRef} />
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

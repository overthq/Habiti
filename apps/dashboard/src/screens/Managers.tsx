import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Icon, ScrollableScreen, Typography } from '@habiti/components';

import Refresher from '../components/Refresher';
import useRefresh from '../hooks/useRefresh';
import { useStoreManagersQuery } from '../data/queries';
import type { StoreStackScreenProps } from '../navigation/types';
import type { User } from '../data/types';

const Managers: React.FC<StoreStackScreenProps<'Managers'>> = ({
	navigation
}) => {
	const { data, isLoading, refetch } = useStoreManagersQuery();
	const { isRefreshing, onRefresh } = useRefresh({ refetch });

	React.useLayoutEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<Pressable onPress={() => navigation.navigate('Modal.AddManager')}>
					<Icon name='plus' />
				</Pressable>
			)
		});
	}, [navigation]);

	if (isLoading || !data) {
		return <View />;
	}

	return (
		<ScrollableScreen
			refreshControl={
				<Refresher refreshing={isRefreshing} onRefresh={onRefresh} />
			}
		>
			{data.managers.map(manager => (
				<ManagerRow key={manager.id} manager={manager} you={false} />
			))}
		</ScrollableScreen>
	);
};

interface ManagerRowProps {
	manager: User;
	you: boolean;
}

const ManagerRow: React.FC<ManagerRowProps> = ({ manager, you }) => {
	return (
		<View style={styles.container}>
			<Typography>{manager.name}</Typography>
			{you && (
				<View style={styles.you}>
					<Typography size='small' weight='medium' style={styles.youText}>
						You
					</Typography>
				</View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	you: {
		marginLeft: 8,
		paddingVertical: 4,
		backgroundColor: '#D3D3D3',
		borderRadius: 16,
		paddingHorizontal: 8
	},
	youText: {
		color: '#505050'
	}
});

export default Managers;

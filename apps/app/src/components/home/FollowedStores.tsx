import React from 'react';
import { View, Pressable, StyleSheet, FlatList } from 'react-native';
import {
	Avatar,
	Dialog,
	SectionHeader,
	Spacer,
	Typography
} from '@habiti/components';
import { useNavigation, NavigationProp } from '@react-navigation/native';

import type { Store } from '../../data/types';
import type { HomeStackParamList } from '../../navigation/types';

interface FollowedStoresProps {
	followed: Store[];
}

const FollowedStores: React.FC<FollowedStoresProps> = ({ followed }) => {
	const { navigate } = useNavigation<NavigationProp<HomeStackParamList>>();

	const handleStorePress = React.useCallback(
		(storeId: string) => () => {
			navigate('Home.Store', { storeId });
		},
		[]
	);

	return followed.length === 0 ? (
		<Dialog
			title={`You haven't followed any stores yet`}
			description='Discover and follow stores to get started.'
		/>
	) : (
		<View>
			<SectionHeader
				title='Followed stores'
				padded={false}
				action={{
					text: 'View all',
					onPress: () => navigate('Home.FollowedStores')
				}}
			/>

			<Spacer y={8} />

			<FlatList
				style={{ marginHorizontal: -16 }}
				horizontal
				data={followed.slice(0, 8)}
				keyExtractor={item => item.id}
				contentContainerStyle={{ flexGrow: 1, gap: 12, paddingHorizontal: 16 }}
				renderItem={({ item }) => (
					<FollowedStoresItem
						store={item}
						onPress={handleStorePress(item.id)}
					/>
				)}
			/>
		</View>
	);
};

interface FollowedStoresItemProps {
	store: Store;
	onPress(): void;
}

const FollowedStoresItem: React.FC<FollowedStoresItemProps> = ({
	store,
	onPress
}) => (
	<Pressable onPress={onPress}>
		<Avatar
			uri={store.image?.path}
			size={72}
			fallbackText={store.name}
			circle
		/>

		<Spacer y={4} />

		<Typography size='small' weight='medium' style={styles.name}>
			{store.name}
		</Typography>
	</Pressable>
);

const styles = StyleSheet.create({
	name: {
		textAlign: 'center'
	}
});

export default FollowedStores;

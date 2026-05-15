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

	return followed.length === 0 ? (
		<Dialog
			style={styles.dialog}
			title={`You haven't followed any stores yet`}
			description='Discover and follow stores to get started.'
		/>
	) : (
		<View>
			<SectionHeader
				title='Followed stores'
				padded
				action={{
					text: 'View all',
					onPress: () => navigate('Home.FollowedStores')
				}}
			/>
			<Spacer y={8} />
			<FollowedStoresMain followed={followed} />
		</View>
	);
};

interface FollowedStoresMainProps {
	followed: Store[];
}

const FollowedStoresMain: React.FC<FollowedStoresMainProps> = ({
	followed
}) => {
	const { navigate } = useNavigation<NavigationProp<HomeStackParamList>>();

	const handleStorePress = React.useCallback(
		(storeId: string) => () => {
			navigate('Home.Store', { storeId });
		},
		[]
	);

	return (
		<FlatList
			horizontal
			data={followed.slice(0, 8)}
			keyExtractor={item => item.id}
			contentContainerStyle={{ paddingLeft: 16, gap: 12 }}
			renderItem={({ item }) => (
				<FollowedStoresItem store={item} onPress={handleStorePress(item.id)} />
			)}
		/>
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
			size={68}
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
	dialog: {
		marginHorizontal: 16
	},
	name: {
		textAlign: 'center'
	}
});

export default FollowedStores;

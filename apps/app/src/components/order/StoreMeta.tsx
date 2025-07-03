import { Avatar, CustomImage, Typography } from '@habiti/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { Pressable, View } from 'react-native';

import { OrderQuery } from '../../types/api';
import { HomeStackParamList } from '../../types/navigation';

interface StoreMetaProps {
	store: OrderQuery['order']['store'];
}

const StoreMeta: React.FC<StoreMetaProps> = ({ store }) => {
	const { navigate } = useNavigation<NavigationProp<HomeStackParamList>>();

	return (
		<Pressable
			style={{ marginHorizontal: 16, paddingVertical: 12 }}
			onPress={() => {
				navigate('Home.Store', { storeId: store.id });
			}}
		>
			<View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
				<Avatar
					size={40}
					uri={store.image?.path}
					circle
					fallbackText={store.name}
				/>
				<View>
					<Typography weight='medium' size='large'>
						{store.name}
					</Typography>
					<Typography size='small' variant='secondary'>
						Visit store
					</Typography>
				</View>
			</View>
		</Pressable>
	);
};

export default StoreMeta;

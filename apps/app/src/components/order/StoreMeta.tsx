import { CustomImage, Typography, useTheme } from '@habiti/components';
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
	const { theme } = useTheme();

	return (
		<Pressable
			style={{
				marginHorizontal: 16,
				padding: 12,
				borderRadius: 6,
				backgroundColor: theme.input.background
			}}
			onPress={() => {
				navigate('Home.Store', { storeId: store.id });
			}}
		>
			<View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
				<CustomImage height={40} width={40} uri={store.image?.path} circle />
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

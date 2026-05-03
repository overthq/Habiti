import React from 'react';
import { Button, Screen, Typography } from '@habiti/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';

import { AppStackParamList } from '../navigation/types';
import { STORE_CREATION_ENABLED } from '../utils/constants';

const NoStores: React.FC = () => {
	const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();

	if (!STORE_CREATION_ENABLED) {
		return (
			<Screen>
				<Typography>{`Looks like you don't have access to any stores.`}</Typography>
			</Screen>
		);
	}

	return (
		<Screen>
			<Typography>{`Looks like you don't have access to any stores. Create one?`}</Typography>
			<Button
				onPress={() => navigate('Modal.CreateStore')}
				text='Create Store'
			/>
		</Screen>
	);
};

export default NoStores;

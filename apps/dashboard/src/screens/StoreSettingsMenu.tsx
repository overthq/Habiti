import React from 'react';

import StoreMenu from '../components/store/StoreMenu';
import { Screen } from '@habiti/components';
import AndroidHeader from '../components/AndroidHeader';

const StoreSettingsMenu = () => {
	return (
		<Screen style={{ paddingTop: 16 }}>
			<AndroidHeader
				title='Store Settings'
				hasBackButton
				screenPadded={false}
			/>
			<StoreMenu />
		</Screen>
	);
};

export default StoreSettingsMenu;

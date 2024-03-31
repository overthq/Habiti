import { Screen } from '@market/components';
import React from 'react';

import useGoBack from '../hooks/useGoBack';

const NotificationSettings = () => {
	useGoBack();

	return <Screen />;
};

export default NotificationSettings;

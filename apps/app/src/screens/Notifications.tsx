import { Screen } from '@market/components';
import React from 'react';

import useGoBack from '../hooks/useGoBack';

// Updates from orders and stores followed should show up here.

const Notifications = () => {
	useGoBack();

	return <Screen />;
};

export default Notifications;

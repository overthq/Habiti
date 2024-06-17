import { Screen } from '@habiti/components';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { WebView } from 'react-native-webview';

import useGoBack from '../hooks/useGoBack';
import { useCardAuthorizationQuery } from '../types/api';

// Before opening this screen, we should probably explain to users why we have
// to charge them a small amount of money. I should probably also figure out a
// programmatic way to refund the charge.
// We should probably just add all these customers to a cache and send a bulk
// transfer out at the end of each day.
// To do this though, we have to collect their bank account information.
// Or we can just create "Habiti cash" and load the money there, and it can
// be added to their transaction.

const AddCardWebview: React.FC = () => {
	const [{ fetching, data }] = useCardAuthorizationQuery();

	useGoBack('x');

	return (
		<Screen>
			{!fetching && data ? (
				<WebView
					style={{ flex: 1 }}
					source={{ uri: data.cardAuthorization.authorization_url }}
				/>
			) : (
				<View style={{ paddingTop: 16 }}>
					<ActivityIndicator />
				</View>
			)}
		</Screen>
	);
};

export default AddCardWebview;

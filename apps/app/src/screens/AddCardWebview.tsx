import React from 'react';
import { Screen } from '@habiti/components';
import { ActivityIndicator, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { RouteProp, useRoute } from '@react-navigation/native';

import useGoBack from '../hooks/useGoBack';
import { useCardAuthorizationQuery } from '../types/api';
import { AppStackParamList } from '../types/navigation';

// Before opening this screen, we should probably explain to users why we have
// to charge them a small amount of money. I should probably also figure out a
// programmatic way to refund the charge.
// We should probably just add all these customers to a cache and send a bulk
// transfer out at the end of each day.
// To do this though, we have to collect their bank account information.
// Or we can just create "Habiti cash" and load the money there, and it can
// be added to their transaction.

// const {
// 	params: { amount }
// } = useRoute<RouteProp<AppStackParamList, 'Add Card'>>();
// const [{ fetching, data }] = useCardAuthorizationQuery({
// 	variables: { amount }
// });

const AddCardWebview: React.FC = () => {
	useGoBack('x');

	// if (fetching || !data) {
	// 	return (
	// 		<View style={{ flex: 1, paddingTop: 16 }}>
	// 			<ActivityIndicator />
	// 		</View>
	// 	);
	// }

	return (
		<Screen>
			<WebView style={{ flex: 1 }} source={{ uri: 'https://google.com' }} />
		</Screen>
	);
	// return (
	// 	<Screen>
	// 			<WebView
	// 				style={{ flex: 1 }}
	// 				source={{ uri: data.cardAuthorization.authorization_url }}
	// 			/>
	// 		)}
	// 	</Screen>
	// );
};

export default AddCardWebview;

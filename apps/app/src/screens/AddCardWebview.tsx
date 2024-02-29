import { Screen } from '@market/components';
import React from 'react';
import { ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';

import useGoBack from '../hooks/useGoBack';
import { attemptInitialCharge, InitialChargeResponse } from '../utils/payments';

const AddCardWebview: React.FC = () => {
	const [data, setData] = React.useState<InitialChargeResponse>();
	useGoBack();

	const getData = React.useCallback(async () => {
		const fetchedData = await attemptInitialCharge();
		setData(fetchedData);
	}, []);

	React.useEffect(() => {
		getData();
	}, []);

	return (
		<Screen>
			{data ? (
				<WebView style={{ flex: 1 }} source={{ uri: data.authorization_url }} />
			) : (
				<ActivityIndicator />
			)}
		</Screen>
	);
};

export default AddCardWebview;

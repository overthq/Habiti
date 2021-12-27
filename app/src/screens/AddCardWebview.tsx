import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { attemptInitialCharge, InitialChargeResponse } from '../utils/payments';

// This component uses a webview for card tokenization
// using Paystack.
// It will be replaced by a completely native solution,
// when I finish utils/paystack.ts

const AddCardWebview: React.FC = () => {
	const [data, setData] = React.useState<InitialChargeResponse | undefined>();

	const getData = React.useCallback(async () => {
		const fetchedData = await attemptInitialCharge();
		setData(fetchedData);
	}, []);

	React.useEffect(() => {
		getData();
	}, []);

	return (
		<View style={{ flex: 1 }}>
			{data ? (
				<WebView
					style={styles.container}
					source={{ uri: data.authorization_url }}
					onNavigationStateChange={({ url }) => console.log(url)}
				/>
			) : (
				<ActivityIndicator />
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});

export default AddCardWebview;

import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
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
		<View style={styles.container}>
			{data ? (
				<WebView
					style={styles.container}
					source={{ uri: data.authorization_url }}
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

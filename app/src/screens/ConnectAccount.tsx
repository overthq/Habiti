import React from 'react';
import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { useAppSelector } from '../redux/store';
import {
	CONNECT_ACCOUNT_HTML,
	initSendcashPay,
	connectAccount
} from '../utils/connect-account';

const ConnectAccount: React.FC = () => {
	const webviewRef = React.useRef<WebView>(null);
	const userId = useAppSelector(({ auth }) => auth.userId);

	React.useEffect(() => {
		const timeout = setTimeout(() => {
			if (userId) {
				webviewRef.current?.injectJavaScript(connectAccount(userId));
			}
		}, 2000);

		return () => {
			clearTimeout(timeout);
		};
	}, []);

	return (
		<WebView
			style={styles.container}
			ref={webviewRef}
			originWhitelist={['*']}
			source={{ html: CONNECT_ACCOUNT_HTML }}
			injectedJavaScript={initSendcashPay}
		/>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});

export default ConnectAccount;

import React from 'react';
import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { useAppSelector } from '../redux/store';
import { connectAccountHtml } from '../utils/connect-account';

const ConnectAccount: React.FC = () => {
	const webviewRef = React.useRef<WebView>(null);
	const userId = useAppSelector(({ auth }) => auth.userId);

	const html = React.useMemo(() => {
		return connectAccountHtml(userId as string);
	}, [userId]);

	return (
		<WebView
			style={styles.container}
			ref={webviewRef}
			originWhitelist={['*']}
			source={{ html }}
			onMessage={event => console.log({ event })}
		/>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});

export default ConnectAccount;

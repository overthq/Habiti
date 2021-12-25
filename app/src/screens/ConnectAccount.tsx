import React from 'react';
import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
// import { useAppSelector } from '../redux/store';

const ConnectCard: React.FC = () => {
	const webviewRef = React.useRef<WebView>(null);
	// const userId = useAppSelector(({ auth }) => auth.userId);

	return (
		<WebView
			style={styles.container}
			ref={webviewRef}
			originWhitelist={['*']}
			// source={{ html }}
			onMessage={event => console.log({ event })}
		/>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});

export default ConnectCard;

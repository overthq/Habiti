// import { FontAwesome } from '@expo/vector-icons';
// import { Typography, useTheme } from '@habiti/components';
// import * as AppleAuthentication from 'expo-apple-authentication';
// import React from 'react';
// import { Pressable, StyleSheet } from 'react-native';

// interface AppleButtonProps {
// 	onSuccess(token: string): void;
// 	onError(error: Error): void;
// }

// const AppleButton: React.FC<AppleButtonProps> = ({ onSuccess, onError }) => {
// 	const { theme } = useTheme();

// 	const handlePress = async () => {
// 		try {
// 			const credential = await AppleAuthentication.signInAsync({
// 				requestedScopes: [
// 					AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
// 					AppleAuthentication.AppleAuthenticationScope.EMAIL
// 				]
// 			});

// 			if (credential.identityToken) {
// 				onSuccess(credential.identityToken);
// 			}
// 		} catch (error) {
// 			onError(error as Error);
// 		}
// 	};

// 	return (
// 		<Pressable
// 			style={[
// 				styles.container,
// 				{ backgroundColor: theme.button.primary.background }
// 			]}
// 			onPress={handlePress}
// 		>
// 			<FontAwesome name='apple' size={20} color={theme.button.primary.text} />
// 			<Typography
// 				weight='medium'
// 				style={[styles.text, { color: theme.button.primary.text }]}
// 			>
// 				Continue with Apple
// 			</Typography>
// 		</Pressable>
// 	);
// };

// const styles = StyleSheet.create({
// 	container: {
// 		flexDirection: 'row',
// 		alignItems: 'center',
// 		justifyContent: 'center',
// 		padding: 12,
// 		borderRadius: 8,
// 		gap: 8
// 	},
// 	text: {
// 		fontSize: 17
// 	}
// });

// export default AppleButton;

export {};

import {
	Button,
	Screen,
	Spacer,
	TextButton,
	Typography
} from '@habiti/components';
import * as AppleAuthentication from 'expo-apple-authentication';
import React from 'react';
import { Platform, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useShallow } from 'zustand/react/shallow';

import { useAppleSignInMutation } from '../hooks/mutations';
import useStore from '../state';
import type { AppStackScreenProps } from '../navigation/types';

// Normally never seen: the app silently starts a guest session on launch
// (see useSessionQuery). This screen only appears when that fails — e.g. an
// offline first launch — or when logging out while offline.
const Landing: React.FC<AppStackScreenProps<'Landing'>> = ({ navigation }) => {
	const [appleAvailable, setAppleAvailable] = React.useState(false);
	const appleSignInMutation = useAppleSignInMutation();

	const theme = useStore(useShallow(({ theme }) => theme));
	const colorScheme = useColorScheme();
	const dark = theme === 'dark' || (theme === 'auto' && colorScheme === 'dark');

	React.useEffect(() => {
		if (Platform.OS === 'ios') {
			AppleAuthentication.isAvailableAsync().then(setAppleAvailable);
		}
	}, []);

	return (
		<Screen style={{ paddingHorizontal: 16, justifyContent: 'center' }}>
			<SafeAreaView style={{ flex: 1 }}>
				<View style={{ flex: 1 }} />
				<View style={{ flex: 1 }}>
					<Typography
						size='xxxlarge'
						weight='bold'
						style={{ textAlign: 'center' }}
					>
						Habiti
					</Typography>
				</View>
				<View style={{ flex: 1, justifyContent: 'flex-end' }}>
					{appleAvailable && (
						<>
							<AppleAuthentication.AppleAuthenticationButton
								buttonType={
									AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN
								}
								buttonStyle={
									dark
										? AppleAuthentication.AppleAuthenticationButtonStyle.WHITE
										: AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
								}
								cornerRadius={4}
								style={{ height: 44 }}
								onPress={() => appleSignInMutation.mutate()}
							/>
							<Spacer y={12} />
						</>
					)}
					<Button
						text='Sign up'
						onPress={() => navigation.navigate('Register')}
					/>
					<Spacer y={12} />
					<TextButton
						weight='medium'
						style={{ alignSelf: 'center' }}
						onPress={() => navigation.navigate('Authenticate')}
					>
						Already have an account? Log in.
					</TextButton>
					<Spacer y={24} />
				</View>
			</SafeAreaView>
		</Screen>
	);
};

export default Landing;

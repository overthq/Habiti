import React from 'react';
import { Platform, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as AppleAuthentication from 'expo-apple-authentication';
import {
	Button,
	Screen,
	Spacer,
	TextButton,
	Typography,
	useTheme
} from '@habiti/components';

import { useAppleSignInMutation } from '../data/mutations';
import type { AppStackScreenProps } from '../navigation/types';
import { ACCOUNT_CREATION_ENABLED } from '../utils/constants';

const Landing: React.FC<AppStackScreenProps<'Landing'>> = ({ navigation }) => {
	const [appleAvailable, setAppleAvailable] = React.useState(false);
	const appleSignInMutation = useAppleSignInMutation();
	const { name: themeName } = useTheme();

	React.useEffect(() => {
		if (Platform.OS === 'ios') {
			AppleAuthentication.isAvailableAsync().then(setAppleAvailable);
		}
	}, []);

	return (
		<Screen style={{ justifyContent: 'center' }}>
			<SafeAreaView style={{ flex: 1 }}>
				<View style={{ flex: 1 }} />
				<View style={{ flex: 1 }}>
					<Typography
						size='xxxlarge'
						weight='bold'
						style={{ textAlign: 'center' }}
					>
						Habiti Dashboard
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
									themeName === 'dark'
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
					{ACCOUNT_CREATION_ENABLED ? (
						<>
							<Button
								text='Create account'
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
						</>
					) : (
						<>
							<Button
								text='Continue'
								onPress={() => navigation.navigate('Authenticate')}
							/>
						</>
					)}
					<Spacer y={24} />
				</View>
			</SafeAreaView>
		</Screen>
	);
};

export default Landing;

import {
	Button,
	Screen,
	Spacer,
	TextButton,
	Typography,
	useTheme
} from '@habiti/components';
import * as AppleAuthentication from 'expo-apple-authentication';
import React from 'react';
import { Platform, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppleSignInMutation } from '../hooks/mutations';
import type { AppStackScreenProps } from '../navigation/types';

const Landing: React.FC<AppStackScreenProps<'Landing'>> = ({ navigation }) => {
	const [appleAvailable, setAppleAvailable] = React.useState(false);
	const appleSignInMutation = useAppleSignInMutation();
	const { name } = useTheme();

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
									name === 'dark'
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

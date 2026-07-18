import {
	Button,
	Screen,
	Spacer,
	TextButton,
	Typography
} from '@habiti/components';
import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppleSignInButton from '../components/AppleSignInButton';
import { useOpenAuthModal } from '../hooks/useAuth';

const Landing: React.FC = () => {
	const openAuthModal = useOpenAuthModal();

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
						Habiti
					</Typography>
				</View>
				<View style={{ flex: 1, justifyContent: 'flex-end' }}>
					<Button
						text='Sign up'
						onPress={() => openAuthModal('Auth.Register')}
					/>
					<Spacer y={12} />
					<AppleSignInButton />
					<Spacer y={12} />
					<TextButton
						weight='medium'
						style={{ alignSelf: 'center' }}
						onPress={() => openAuthModal()}
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

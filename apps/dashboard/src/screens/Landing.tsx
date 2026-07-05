import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
	Button,
	Screen,
	Spacer,
	TextButton,
	Typography
} from '@habiti/components';

import type { AppStackScreenProps } from '../navigation/types';
import { ACCOUNT_CREATION_ENABLED } from '../utils/constants';

const Landing: React.FC<AppStackScreenProps<'Landing'>> = ({ navigation }) => {
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

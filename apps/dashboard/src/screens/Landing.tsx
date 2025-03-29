import {
	Button,
	Screen,
	Spacer,
	TextButton,
	Typography
} from '@habiti/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppStackParamList } from '../types/navigation';

const Landing = () => {
	const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();

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
						Habiti Dashboard
					</Typography>
				</View>
				<View style={{ flex: 1, justifyContent: 'flex-end' }}>
					<Button text='Create account' onPress={() => navigate('Register')} />
					<Spacer y={12} />
					<TextButton
						weight='medium'
						style={{ alignSelf: 'center' }}
						onPress={() => navigate('Authenticate')}
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

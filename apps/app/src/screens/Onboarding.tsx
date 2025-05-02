import {
	Button,
	FormInput,
	Spacer,
	TextButton,
	Typography,
	Screen
} from '@habiti/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { View, Dimensions, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useRegisterMutation } from '../types/api';
import { AppStackParamList } from '../types/navigation';

interface RegisterFormValues {
	name: string;
	email: string;
	password: string;
	confirmPassword: string;
	pushToken?: string;
}

const { width } = Dimensions.get('window');

const RegisterForm = () => {
	const methods = useForm<RegisterFormValues>({
		defaultValues: {
			name: '',
			email: '',
			password: '',
			confirmPassword: '',
			pushToken: undefined
		}
	});
	const [{ fetching }, register] = useRegisterMutation();
	const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();

	const onSubmit = async (values: RegisterFormValues) => {
		const { error, data } = await register({
			input: {
				name: values.name,
				email: values.email,
				password: values.password
			}
		});

		if (error) {
			console.log(error);
		} else if (data?.register) {
			navigate('Authenticate');
		}
	};

	return (
		<Screen style={{ padding: 16 }}>
			<SafeAreaView style={{ flex: 1 }}>
				<FormProvider {...methods}>
					<Spacer y={32} />
					<Typography weight='bold' size='xxxlarge'>
						Create your account
					</Typography>
					<Typography variant='secondary'>Let's get you started.</Typography>
					<Spacer y={16} />
					<FormInput
						name='name'
						control={methods.control}
						label='Name'
						placeholder='John Doe'
						autoCorrect={false}
					/>
					<Spacer y={8} />
					<FormInput
						name='email'
						control={methods.control}
						label='Email address'
						placeholder='john.appleseed@gmail.com'
						keyboardType='email-address'
						autoCapitalize='none'
						autoCorrect={false}
					/>
					<Spacer y={8} />
					<FormInput
						name='password'
						control={methods.control}
						label='Password'
						placeholder='Password'
						secureTextEntry
						autoCapitalize='none'
					/>
					<Spacer y={8} />
					<FormInput
						name='confirmPassword'
						control={methods.control}
						label='Confirm password'
						placeholder='Confirm password'
						secureTextEntry
						autoCapitalize='none'
					/>
					<Spacer y={16} />
					<Button
						loading={fetching}
						text='Create account'
						onPress={methods.handleSubmit(onSubmit)}
					/>
				</FormProvider>
			</SafeAreaView>
		</Screen>
	);
};

const PushNotifications = () => {
	const handleRegistrationError = (errorMessage: string) => {
		Alert.alert(errorMessage);
		throw new Error(errorMessage);
	};

	const requestPushPermission = async () => {
		if (Platform.OS === 'android') {
			Notifications.setNotificationChannelAsync('default', {
				name: 'default',
				importance: Notifications.AndroidImportance.MAX,
				vibrationPattern: [0, 250, 250, 250],
				lightColor: '#FF231F7C'
			});
		}

		if (Device.isDevice) {
			const { status: existingStatus } =
				await Notifications.getPermissionsAsync();
			let finalStatus = existingStatus;
			if (existingStatus !== 'granted') {
				const { status } = await Notifications.requestPermissionsAsync();
				finalStatus = status;
			}
			if (finalStatus !== 'granted') {
				handleRegistrationError(
					'Permission not granted to get push token for push notification!'
				);
				return;
			}
			const projectId =
				Constants?.expoConfig?.extra?.eas?.projectId ??
				Constants?.easConfig?.projectId;

			if (!projectId) {
				handleRegistrationError('Project ID not found');
			}

			try {
				const pushTokenString = (
					await Notifications.getExpoPushTokenAsync({
						projectId
					})
				).data;
				return pushTokenString;
			} catch (e: unknown) {
				handleRegistrationError(`${e}`);
			}
		} else {
			handleRegistrationError(
				'Must use physical device for push notifications'
			);
		}
	};

	return (
		<View style={{ width, paddingHorizontal: 16 }}>
			<Spacer y={32} />
			<Typography size='xxlarge' weight='bold'>
				Turn on push notifications.
			</Typography>
			<Typography variant='secondary'>
				We use this to send messages related to your account, orders and stores
				you follow.
			</Typography>
			<Spacer y={16} />
			<Button text='Turn on' onPress={requestPushPermission} />
			<Spacer y={8} />
			<TextButton style={{ alignSelf: 'center' }}>Maybe later</TextButton>
		</View>
	);
};

const Onboarding: React.FC = () => {
	const methods = useForm<RegisterFormValues>({
		defaultValues: {
			name: '',
			email: '',
			password: '',
			confirmPassword: '',
			pushToken: undefined
		}
	});

	return (
		<FormProvider {...methods}>
			<SafeAreaView style={{ flex: 1 }}>
				<RegisterForm />
			</SafeAreaView>
		</FormProvider>
	);
};

export default Onboarding;

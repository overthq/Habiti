import {
	Button,
	FormInput,
	Spacer,
	TextButton,
	Typography
} from '@market/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import React from 'react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import {
	View,
	StyleSheet,
	Dimensions,
	Alert,
	Platform,
	ViewToken
} from 'react-native';
import Animated from 'react-native-reanimated';
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

const Name = () => {
	const { control } = useFormContext<RegisterFormValues>();
	const { toNext } = useOnboardingContext();

	return (
		<View style={{ width, paddingHorizontal: 16 }}>
			<Spacer y={32} />
			<Typography weight='bold' size='xxxlarge'>
				What's your name?
			</Typography>
			<Typography variant='secondary'>Let's meet you.</Typography>
			<Spacer y={16} />
			<FormInput
				name='name'
				control={control}
				label='Name'
				placeholder='John Doe'
				autoCorrect={false}
			/>
			<Spacer y={16} />
			<Button text='Next' onPress={toNext} />
		</View>
	);
};

const Email = () => {
	const { control } = useFormContext<RegisterFormValues>();
	const { toNext } = useOnboardingContext();

	return (
		<View style={{ width, paddingHorizontal: 16 }}>
			<Spacer y={32} />
			<Typography weight='bold' size='xxxlarge'>
				Enter your email.
			</Typography>
			<Typography variant='secondary'>We won't spam you, promise.</Typography>
			<Spacer y={16} />
			<FormInput
				name='email'
				control={control}
				label='Email address'
				placeholder='john.appleseed@gmail.com'
				keyboardType='email-address'
				autoCapitalize='none'
			/>
			<Spacer y={16} />
			<Button text='Next' onPress={toNext} />
		</View>
	);
};

const Password = () => {
	const { control, handleSubmit } = useFormContext<RegisterFormValues>();
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
			// FIXME: UX hole! Let them know that their account has been created.
			navigate('Authenticate');
		}
	};

	return (
		<View style={{ width, paddingHorizontal: 16 }}>
			<Spacer y={32} />
			<Typography weight='bold' size='xxxlarge'>
				Create a password.
			</Typography>
			<Typography variant='secondary'>
				Help us keep your account secure.
			</Typography>
			<Spacer y={16} />
			<FormInput
				name='password'
				control={control}
				label='Password'
				placeholder='Password'
				secureTextEntry
			/>
			<Spacer y={8} />
			<FormInput
				name='confirmPassword'
				control={control}
				label='Confirm password'
				placeholder='Confirm password'
				secureTextEntry
			/>
			<Spacer y={16} />
			<Button
				loading={fetching}
				text='Create account'
				onPress={handleSubmit(onSubmit)}
			/>
		</View>
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
				console.log(pushTokenString);
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

const steps = [
	{ id: 'name', screen: <Name /> },
	{ id: 'email', screen: <Email /> },
	{ id: 'password', screen: <Password /> }
] as const;

const Onboarding: React.FC = () => {
	const scrollRef =
		React.useRef<Animated.FlatList<(typeof steps)[number]>>(null);
	const [activeStepIndex, setActiveStepIndex] = React.useState(0);

	const methods = useForm<RegisterFormValues>({
		defaultValues: {
			name: '',
			email: '',
			password: '',
			confirmPassword: '',
			pushToken: undefined
		}
	});

	const toNext = React.useCallback(() => {
		scrollRef.current?.scrollToIndex({
			index: activeStepIndex + 1,
			animated: true
		});
	}, [scrollRef.current, activeStepIndex]);

	const handleViewableItemsChanged = React.useCallback(
		({ viewableItems }: { viewableItems: ViewToken[] }) => {
			if (viewableItems[0]?.index) {
				setActiveStepIndex(viewableItems[0].index);
			}
		},
		[]
	);

	return (
		<OnboardingContext.Provider value={{ toNext }}>
			<FormProvider {...methods}>
				<SafeAreaView style={{ flex: 1 }}>
					<View style={styles.container}>
						<Animated.FlatList
							ref={scrollRef}
							horizontal
							decelerationRate='fast'
							snapToInterval={width}
							scrollEnabled={false}
							showsHorizontalScrollIndicator={false}
							style={{ flex: 1 }}
							data={steps}
							keyExtractor={s => s.id}
							renderItem={({ item }) => item.screen}
							onViewableItemsChanged={handleViewableItemsChanged}
						/>
					</View>
				</SafeAreaView>
			</FormProvider>
		</OnboardingContext.Provider>
	);
};

interface OnboardingContextType {
	toNext(): void;
}

const OnboardingContext = React.createContext<OnboardingContextType>(null);

const useOnboardingContext = () => {
	const context = React.useContext(OnboardingContext);

	if (!context) {
		throw new Error('Must be used inside an OnboardingContext.Provider');
	}

	return context;
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});

export default Onboarding;

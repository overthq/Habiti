import {
	Button,
	FormInput,
	Spacer,
	TextButton,
	Typography
} from '@market/components';
import React from 'react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

interface RegisterFormValues {
	name: string;
	email: string;
	password: string;
	confirmPassword: string;
	pushToken: string;
}

const { width } = Dimensions.get('window');

const Name = () => {
	const { control } = useFormContext<RegisterFormValues>();

	return (
		<View style={{ width, paddingHorizontal: 16 }}>
			<Spacer y={32} />
			<Typography weight='bold' size='xxxlarge'>
				What's your name?
			</Typography>
			<Typography variant='secondary'>Let's meet you</Typography>
			<Spacer y={16} />
			<FormInput
				name='name'
				control={control}
				label='Name'
				placeholder='John Doe'
			/>
			<Spacer y={16} />
			<Button text='Next' />
		</View>
	);
};

const Email = () => {
	const { control } = useFormContext<RegisterFormValues>();

	return (
		<View style={{ width, paddingHorizontal: 16 }}>
			<Spacer y={32} />
			<Typography weight='bold' size='xxxlarge'>
				Enter your email
			</Typography>
			<Typography variant='secondary'>We won't spam you, promise.</Typography>
			<Spacer y={16} />
			<FormInput
				name='email'
				control={control}
				label='Email address'
				placeholder='john.appleseed@gmail.com'
			/>
			<Spacer y={16} />
			<Button text='Next' />
		</View>
	);
};

const Password = () => {
	const { control } = useFormContext<RegisterFormValues>();

	return (
		<View style={{ width, paddingHorizontal: 16 }}>
			<Spacer y={32} />
			<Typography weight='bold' size='xxxlarge'>
				Create a password
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
			/>
			<Spacer y={8} />
			<FormInput
				name='confirmPassword'
				control={control}
				label='Confirm password'
				placeholder='Confirm password'
			/>
			<Spacer y={16} />
			<Button text='Next' />
		</View>
	);
};

const PushNotifications = () => {
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
			<Button text='Turn on' />
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
			pushToken: ''
		}
	});

	return (
		<FormProvider {...methods}>
			<SafeAreaView style={{ flex: 1 }}>
				<View style={styles.container}>
					<Animated.ScrollView
						horizontal
						decelerationRate='fast'
						snapToInterval={width}
						scrollEnabled={false}
						showsHorizontalScrollIndicator={false}
						style={{ flex: 1 }}
					>
						<Name />
						<Email />
						<Password />
						<PushNotifications />
					</Animated.ScrollView>
				</View>
			</SafeAreaView>
		</FormProvider>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});

export default Onboarding;

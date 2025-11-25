import {
	Button,
	FormInput,
	Typography,
	Screen,
	Spacer,
	Icon
} from '@habiti/components';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { z } from 'zod';

import { useRegisterMutation } from '../data/mutations';

const registerSchema = z.object({
	name: z.string().min(2, 'Name must be at least 2 characters'),
	email: z.string().email('Invalid email address'),
	password: z.string().min(8, 'Password must be at least 8 characters')
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const Register: React.FC = () => {
	const { goBack } = useNavigation();
	const registerMutation = useRegisterMutation();
	const methods = useForm<RegisterFormValues>({
		defaultValues: { name: '', email: '', password: '' },
		resolver: zodResolver(registerSchema)
	});

	const onSubmit = (values: RegisterFormValues) => {
		registerMutation.mutate({
			email: values.email,
			name: values.name,
			password: values.password
		});
	};

	return (
		<Screen style={{ padding: 16 }}>
			<SafeAreaView style={{ flex: 1 }}>
				<Pressable onPress={goBack}>
					<Icon name='chevron-left' />
				</Pressable>
				<Spacer y={8} />
				<Typography
					size='xxxlarge'
					weight='bold'
				>{`Let's meet you.`}</Typography>
				<Spacer y={4} />
				<Typography variant='secondary'>
					This helps us in personalizing your experience.
				</Typography>
				<Spacer y={16} />
				<FormInput
					name='name'
					label='Name'
					placeholder='John Doe'
					control={methods.control}
				/>
				<Spacer y={8} />
				<FormInput
					name='email'
					label='Email address'
					placeholder='john.doe@gmail.com'
					control={methods.control}
					autoCapitalize='none'
				/>
				<Spacer y={8} />
				<FormInput
					name='password'
					label='Password'
					placeholder='Password'
					control={methods.control}
					secureTextEntry
				/>
				<Spacer y={16} />
				<Button
					text='Register'
					onPress={methods.handleSubmit(onSubmit)}
					loading={registerMutation.isPending}
					disabled={!methods.formState.isValid}
				/>
			</SafeAreaView>
		</Screen>
	);
};

export default Register;

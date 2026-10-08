import React from 'react';
import { Pressable } from 'react-native';
import { Button, Icon, Screen, Spacer, Typography } from '@habiti/components';
import { zodResolver } from '@hookform/resolvers/zod';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Controller, useForm } from 'react-hook-form';
import { SafeAreaView } from 'react-native-safe-area-context';
import { z } from 'zod';

import CodeInput from '../components/CodeInput';
import { useVerifyCodeMutation } from '../data/mutations';
import { AppStackParamList, AppStackScreenProps } from '../navigation/types';

const verifySchema = z.object({
	code: z
		.string()
		.length(6)
		.regex(/^\d{6}$/)
});

type VerifyFormValues = z.infer<typeof verifySchema>;

const Verify = ({ navigation }: AppStackScreenProps<'Verify'>) => {
	const { params } = useRoute<RouteProp<AppStackParamList, 'Verify'>>();
	const verifyCodeMutation = useVerifyCodeMutation();

	const methods = useForm<VerifyFormValues>({
		resolver: zodResolver(verifySchema),
		defaultValues: { code: '' },
		mode: 'onChange'
	});

	const onSubmit = (values: VerifyFormValues) => {
		verifyCodeMutation.mutate({
			email: params.email,
			code: values.code
		});
	};

	const handleBack = () => {
		navigation.goBack();
	};

	return (
		<Screen>
			<SafeAreaView>
				<Pressable onPress={handleBack}>
					<Icon name='chevron-left' />
				</Pressable>
				<Spacer y={16} />
				<Typography size='xxxlarge' weight='bold'>
					Verify your email
				</Typography>
				<Spacer y={4} />
				<Typography variant='secondary'>
					A verification code was sent to your inbox.
				</Typography>
				<Spacer y={32} />
				<Controller
					name='code'
					control={methods.control}
					render={({ field }) => (
						<CodeInput
							value={field.value}
							onChangeText={field.onChange}
							autoFocus
						/>
					)}
				/>
				<Spacer y={16} />
				<Button
					text='Verify'
					onPress={methods.handleSubmit(onSubmit)}
					loading={verifyCodeMutation.isPending}
					disabled={!methods.formState.isValid}
				/>
			</SafeAreaView>
		</Screen>
	);
};

export default Verify;

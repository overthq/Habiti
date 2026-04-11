import React from 'react';
import { Pressable, View, StyleSheet } from 'react-native';
import {
	Button,
	FormInput,
	Icon,
	Screen,
	Spacer,
	Typography
} from '@habiti/components';
import { zodResolver } from '@hookform/resolvers/zod';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import { SafeAreaView } from 'react-native-safe-area-context';
import { z } from 'zod';

import { useVerifyCodeMutation } from '../data/mutations';
import { AppStackParamList, AppStackScreenProps } from '../navigation/types';
import CodeInput from '../components/verify/CodeInput';

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

	const code = methods.watch('code');

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
		<Screen style={{ padding: 16 }}>
			<Pressable onPress={handleBack}>
				<Icon name='arrow-left' />
			</Pressable>

			<SafeAreaView>
				<Typography size='xxxlarge' weight='bold'>
					Enter verification code
				</Typography>
				<Typography variant='secondary'>
					A verification code was sent to {params.email}.
				</Typography>
				<FormInput
					name='code'
					control={methods.control}
					autoFocus
					style={styles.hidden}
					keyboardType='number-pad'
					maxLength={6}
				/>
				<Spacer y={16} />
				<View style={styles.inputs}>
					{Array(6)
						.fill(0)
						.map((_, index) => (
							<CodeInput key={index} value={code[index]} />
						))}
				</View>
				<Spacer y={32} />
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

const styles = StyleSheet.create({
	inputs: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		gap: 16
	},
	hidden: {
		height: 1,
		width: 1,
		opacity: 0
	}
});

export default Verify;

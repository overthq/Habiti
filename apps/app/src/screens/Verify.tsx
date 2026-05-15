import React from 'react';
import { Pressable, View, StyleSheet } from 'react-native';
import {
	Button,
	FormInput,
	Icon,
	Screen,
	Spacer,
	Typography,
	useTheme
} from '@habiti/components';
import { zodResolver } from '@hookform/resolvers/zod';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import Animated, {
	useAnimatedStyle,
	withTiming
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { z } from 'zod';

import { useVerifyCodeMutation } from '../hooks/mutations';
import type {
	AppStackParamList,
	AppStackScreenProps
} from '../navigation/types';

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
		<Screen>
			<SafeAreaView>
				<Pressable onPress={handleBack}>
					<Icon name='chevron-left' />
				</Pressable>
				<Spacer y={16} />
				<Typography size='xxxlarge' weight='bold'>
					Enter verification code
				</Typography>
				<Typography variant='secondary'>
					A verification code was sent to {params.email}
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

interface CodeInputProps {
	value: string;
}

const CodeInput: React.FC<CodeInputProps> = ({ value }) => {
	const { theme } = useTheme();

	const style = useAnimatedStyle(() => ({
		borderColor: withTiming(theme.text[value ? 'primary' : 'tertiary'])
	}));

	return (
		<Pressable style={{ flex: 1 }}>
			<Animated.View style={[styles.code, style]}>
				<Typography weight='medium' size='xlarge'>
					{value}
				</Typography>
			</Animated.View>
		</Pressable>
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
	},
	code: {
		flexGrow: 1,
		height: 48,
		borderRadius: 6,
		padding: 2,
		justifyContent: 'center',
		alignItems: 'center',
		borderWidth: 1
	}
});

export default Verify;

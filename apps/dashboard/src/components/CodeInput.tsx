import React from 'react';
import { AppState, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Typography, useTheme } from '@habiti/components';
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withRepeat,
	withSequence,
	withTiming
} from 'react-native-reanimated';

const CODE_LENGTH = 6;

interface CodeInputProps {
	value: string;
	onChangeText: (value: string) => void;
	label?: string;
	autoFocus?: boolean;
}

const CodeInput: React.FC<CodeInputProps> = ({
	value,
	onChangeText,
	label,
	autoFocus
}) => {
	const { theme } = useTheme();
	const inputRef = React.useRef<TextInput>(null);
	const [focused, setFocused] = React.useState(false);

	React.useEffect(() => {
		const subscription = AppState.addEventListener('change', nextState => {
			if (nextState === 'active') {
				inputRef.current?.focus();
			}
		});

		return () => subscription.remove();
	}, []);

	return (
		<View>
			{label && (
				<Typography
					size='small'
					weight='medium'
					style={[styles.label, { color: theme.input.label }]}
				>
					{label}
				</Typography>
			)}
			<TextInput
				ref={inputRef}
				value={value}
				onChangeText={text =>
					onChangeText(text.replace(/\D/g, '').slice(0, CODE_LENGTH))
				}
				onFocus={() => setFocused(true)}
				onBlur={() => setFocused(false)}
				autoFocus={autoFocus}
				style={styles.hidden}
				keyboardType='number-pad'
				maxLength={CODE_LENGTH}
				textContentType='oneTimeCode'
				autoComplete='sms-otp'
			/>
			<Pressable style={styles.boxes} onPress={() => inputRef.current?.focus()}>
				{Array.from({ length: CODE_LENGTH }, (_, index) => (
					<View
						key={index}
						style={[styles.box, { backgroundColor: theme.input.background }]}
					>
						{focused && index === value.length ? (
							<Caret />
						) : (
							<Typography
								weight='medium'
								size='xlarge'
								style={{ color: theme.input.text }}
							>
								{value[index]}
							</Typography>
						)}
					</View>
				))}
			</Pressable>
		</View>
	);
};

const CARET_BLINK = { duration: 500 };

const Caret: React.FC = () => {
	const { theme } = useTheme();
	const opacity = useSharedValue(1);

	React.useEffect(() => {
		opacity.value = withRepeat(
			withSequence(withTiming(0, CARET_BLINK), withTiming(1, CARET_BLINK)),
			-1
		);
	}, [opacity]);

	const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

	return (
		<Animated.View
			style={[styles.caret, { backgroundColor: theme.text.primary }, style]}
		/>
	);
};

const styles = StyleSheet.create({
	label: {
		marginBottom: 4
	},
	hidden: {
		position: 'absolute',
		height: 1,
		width: 1,
		opacity: 0
	},
	boxes: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8
	},
	box: {
		flex: 1,
		maxWidth: 48,
		height: 48,
		borderRadius: 6,
		justifyContent: 'center',
		alignItems: 'center'
	},
	caret: {
		width: 2,
		height: 24,
		borderRadius: 1
	}
});

export default CodeInput;

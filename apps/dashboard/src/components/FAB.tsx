import { PillButton } from '@habiti/components';
import { PressableProps, StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-screens/experimental';

interface FABProps extends Omit<PressableProps, 'style'> {
	text: string;
	safeAreaPadding?: boolean;
	style?: ViewStyle;
}

// The native tab bar draws over the screen rather than taking layout space, so
// `useSafeAreaInsets` (which reports window insets) doesn't account for it.
// This SafeAreaView reads the insets of the native view it's mounted in, so it
// clears the tab bar on tab screens and the home indicator everywhere else.
const FAB: React.FC<FABProps> = ({
	text,
	safeAreaPadding,
	style,
	...props
}) => {
	return (
		<SafeAreaView
			edges={{ bottom: true }}
			pointerEvents='box-none'
			style={styles.container}
		>
			<PillButton
				text={text}
				icon='plus'
				size='large'
				style={{
					alignSelf: 'center',
					marginBottom: safeAreaPadding ? 0 : 16,
					...style
				}}
				{...props}
			/>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
		justifyContent: 'flex-end'
	}
});

export default FAB;

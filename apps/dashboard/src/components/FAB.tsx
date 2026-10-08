import { PillButton } from '@habiti/components';
import { PressableProps, StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-screens/experimental';

interface FABProps extends Omit<PressableProps, 'style'> {
	text: string;
	safeAreaPadding?: boolean;
	style?: ViewStyle;
}

const FAB: React.FC<FABProps> = ({
	text,
	safeAreaPadding,
	style,
	...props
}) => {
	return (
		<SafeAreaView edges={{ bottom: true }} style={styles.container}>
			<PillButton
				text={text}
				icon='plus'
				size='large'
				style={{
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
		bottom: 0,
		alignSelf: 'center'
	}
});

export default FAB;

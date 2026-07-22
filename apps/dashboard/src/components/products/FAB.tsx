import { PillButton } from '@habiti/components';
import { PressableProps, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
	const { bottom } = useSafeAreaInsets();

	return (
		<PillButton
			text={text}
			icon='plus'
			size='large'
			style={{
				position: 'absolute',
				alignSelf: 'center',
				bottom: safeAreaPadding ? bottom : 16,
				...style
			}}
			{...props}
		/>
	);
};

export default FAB;

import { Pressable, Text, type PressableProps } from 'react-native';

interface PillButtonProps extends PressableProps {}

const PillButton: React.FC<PillButtonProps> = ({ ...props }) => {
	return (
		<Pressable {...props}>
			<Text></Text>
		</Pressable>
	);
};

export default PillButton;

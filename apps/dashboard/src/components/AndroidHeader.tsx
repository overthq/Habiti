import { View, Pressable, StyleSheet, Platform } from 'react-native';
import { Icon, Typography, useTheme } from '@habiti/components';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface AndroidHeaderProps {
	title: string;
	hasBackButton?: boolean;
}

const AndroidHeader = ({ title, hasBackButton = true }: AndroidHeaderProps) => {
	const { top } = useSafeAreaInsets();
	const { theme } = useTheme();
	const { goBack } = useNavigation();

	if (Platform.OS !== 'android') return null;

	return (
		<View
			style={{
				paddingTop: top + 16,
				paddingBottom: 16,
				paddingHorizontal: 16,
				flexDirection: 'row',
				borderColor: theme.border.color,
				borderBottomWidth: StyleSheet.hairlineWidth,
				gap: 12,
				alignItems: 'center',
				justifyContent: 'space-between'
			}}
		>
			<View style={{ width: 24, height: 24 }}>
				{hasBackButton && (
					<Pressable onPress={goBack} hitSlop={12}>
						<Icon name='chevron-left' style={{ marginLeft: -4 }} />
					</Pressable>
				)}
			</View>

			<View style={{ flex: 1, alignItems: 'center' }}>
				<Typography size='large' weight='medium'>
					{title}
				</Typography>
			</View>

			<View style={{ width: 24, height: 24 }} />
		</View>
	);
};

export default AndroidHeader;

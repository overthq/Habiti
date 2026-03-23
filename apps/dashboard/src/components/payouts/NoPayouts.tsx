import { PillButton, Spacer, Typography, useTheme } from '@habiti/components';
import { View } from 'react-native';

interface NoPayoutsProps {
	action(): void;
}

const NoPayouts: React.FC<NoPayoutsProps> = ({ action }) => {
	const { theme } = useTheme();

	return (
		<View
			style={{
				backgroundColor: theme.input.background,
				padding: 12,
				borderRadius: 6,
				marginVertical: 8
			}}
		>
			<Typography weight='medium' size='large'>
				No payouts
			</Typography>
			<Spacer y={4} />
			<Typography variant='secondary'>
				Created payouts will appear here.
			</Typography>
			<Spacer y={8} />
			<View style={{ backgroundColor: theme.border.color, height: 1 }} />
			<Spacer y={8} />
			<PillButton size='small' text='Add payout' onPress={action} />
		</View>
	);
};

export default NoPayouts;

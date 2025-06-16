import React from 'react';
import { Pressable, View } from 'react-native';
import { Spacer, Typography, useTheme } from '@habiti/components';

interface CategorySelectorItemProps {
	name: string;
	onPress(): void;
	active: boolean;
}

const CategorySelectorItem: React.FC<CategorySelectorItemProps> = ({
	name,
	onPress,
	active
}) => {
	const { theme } = useTheme();

	return (
		<Pressable onPress={onPress}>
			<View style={{ paddingHorizontal: 16 }}>
				<Typography weight='medium' variant={active ? 'primary' : 'secondary'}>
					{name}
				</Typography>
			</View>
			<Spacer y={8} />
			<View style={{ alignItems: 'center' }}>
				<View
					style={{
						height: 2,
						backgroundColor: active ? theme.text.primary : 'transparent',
						width: '100%'
					}}
				/>
			</View>
		</Pressable>
	);
};

export default CategorySelectorItem;

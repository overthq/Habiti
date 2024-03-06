import { Typography } from '@market/components';
import { Pressable } from 'react-native';

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
	return (
		<Pressable onPress={onPress} disabled={active} style={{ marginRight: 8 }}>
			<Typography weight='medium' variant={active ? 'primary' : 'secondary'}>
				{name}
			</Typography>
		</Pressable>
	);
};

export default CategorySelectorItem;

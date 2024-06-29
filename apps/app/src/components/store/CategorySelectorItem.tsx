import { Typography } from '@habiti/components';
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
		<Pressable onPress={onPress} disabled={active} style={{ marginRight: 12 }}>
			<Typography weight='medium' variant={active ? 'primary' : 'disabled'}>
				{name}
			</Typography>
		</Pressable>
	);
};

export default CategorySelectorItem;

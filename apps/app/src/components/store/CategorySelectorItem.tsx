import { TextButton } from '@habiti/components';

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
		<TextButton onPress={onPress} active={active} weight='medium' size={15}>
			{name}
		</TextButton>
	);
};

export default CategorySelectorItem;

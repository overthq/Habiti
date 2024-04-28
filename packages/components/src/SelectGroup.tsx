import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';

import Radio from './Radio';
import { useTheme } from './Theme';
import Typography from './Typography';

interface SelectOption {
	title: string;
	value: string;
}

interface SelectGroupProps {
	selected: string;
	options: SelectOption[];
	onSelect(value: string): void;
}

const SelectGroup: React.FC<SelectGroupProps> = ({
	selected,
	options,
	onSelect
}) => {
	const { theme } = useTheme();

	const handlePress = (value: string) => () => {
		onSelect(value);
	};

	return (
		<View
			style={[styles.container, { backgroundColor: theme.input.background }]}
		>
			{options.map(o => (
				<SelectGroupOption
					key={o.value}
					{...o}
					selected={selected === o.value}
					onPress={handlePress(o.value)}
				/>
			))}
		</View>
	);
};

interface SelectGroupOptionProps extends SelectOption {
	selected: boolean;
	onPress(): void;
}

const SelectGroupOption: React.FC<SelectGroupOptionProps> = ({
	title,
	selected,
	onPress
}) => {
	return (
		<Pressable
			onPress={onPress}
			style={{
				flexDirection: 'row',
				justifyContent: 'space-between',
				paddingVertical: 8,
				paddingHorizontal: 16
			}}
		>
			<Typography>{title}</Typography>
			<Radio active={selected} />
		</Pressable>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingVertical: 2,
		borderRadius: 6,
		overflow: 'hidden'
	}
});

export default SelectGroup;

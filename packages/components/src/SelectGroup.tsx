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
}

const SelectGroup: React.FC<SelectGroupProps> = ({ selected, options }) => {
	const { theme } = useTheme();

	return (
		<View
			style={[styles.container, { backgroundColor: theme.input.background }]}
		>
			{options.map(o => (
				<SelectGroupOption
					key={o.value}
					{...o}
					selected={selected === o.value}
				/>
			))}
		</View>
	);
};

interface SelectGroupOptionProps extends SelectOption {
	selected: boolean;
}

const SelectGroupOption: React.FC<SelectGroupOptionProps> = ({
	title,
	selected
}) => {
	return (
		<Pressable>
			<Typography>{title}</Typography>
			<Radio active={selected} />
		</Pressable>
	);
};

const styles = StyleSheet.create({
	container: {
		borderRadius: 4,
		overflow: 'hidden'
	}
});

export default SelectGroup;

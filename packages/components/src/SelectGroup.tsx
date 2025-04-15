import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';

import { Icon } from './Icon';
import { useTheme } from './Theme';
import Typography from './Typography';

interface SelectOption {
	title: string;
	value?: string;
}

interface SelectGroupProps {
	selected?: string;
	options: SelectOption[];
	onSelect(value?: string): void;
	capitalize?: boolean;
}

const SelectGroup: React.FC<SelectGroupProps> = ({
	selected,
	options,
	onSelect,
	capitalize
}) => {
	const { theme } = useTheme();

	const handlePress = (value?: string) => () => {
		onSelect(value);
	};

	return (
		<View
			style={[styles.container, { backgroundColor: theme.input.background }]}
		>
			{options.map((o, i) => (
				<SelectGroupOption
					key={String(o.value)}
					{...o}
					selected={selected === o.value}
					onPress={handlePress(o.value)}
					last={i === options.length - 1}
					capitalize={capitalize}
				/>
			))}
		</View>
	);
};

interface SelectGroupOptionProps extends SelectOption {
	selected: boolean;
	onPress(): void;
	last: boolean;
	extra?: React.ReactNode;
	capitalize?: boolean;
}

const SelectGroupOption: React.FC<SelectGroupOptionProps> = ({
	title,
	selected,
	onPress,
	last,
	extra,
	capitalize
}) => {
	const { theme } = useTheme();

	return (
		<Pressable onPress={onPress} style={styles.row}>
			<View
				style={[
					styles.main,
					!last ? { borderBottomWidth: 1, borderColor: theme.border.color } : {}
				]}
			>
				<View style={{ flexDirection: 'row', gap: 8 }}>
					{extra}
					<Typography
						weight={selected ? 'medium' : 'regular'}
						variant={selected ? 'primary' : 'secondary'}
						style={capitalize ? { textTransform: 'capitalize' } : {}}
					>
						{title}
					</Typography>
				</View>
				{selected && <Icon name='check' size={20} />}
			</View>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	container: {
		borderRadius: 6,
		overflow: 'hidden'
	},
	row: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingLeft: 12
	},
	main: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		height: 40,
		paddingRight: 12
	}
});

export default SelectGroup;

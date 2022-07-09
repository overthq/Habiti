import React from 'react';
import { Text, StyleSheet } from 'react-native';
import type { TextProps } from 'react-native';

interface TypographyProps extends TextProps {
	children: React.ReactNode;
	variant: 'body' | 'title';
	color?: string;
}

const Typography: React.FC<TypographyProps> = ({
	variant,
	children,
	style
}) => {
	return <Text style={[styles[variant], style]}>{children}</Text>;
};

const styles = StyleSheet.create({
	body: {},
	title: {}
});

export default Typography;

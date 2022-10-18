import React from 'react';
import { Control, useController } from 'react-hook-form';

import Input from './Input';
import type { InputProps } from './Input';

// TODO: Find a way to infer the type of the Control based on the
// 'name' property (might need to finally REALLY learn generics).

interface FormInputProps extends InputProps {
	name: string; // keyof T
	control: Control<any>;
}

const FormInput: React.FC<FormInputProps> = ({
	name,
	control,
	style,
	...props
}) => {
	const { field } = useController({ control, name });

	return (
		<Input
			value={field.value}
			onChangeText={field.onChange}
			onBlur={field.onBlur}
			style={style}
			{...props}
		/>
	);
};

export default FormInput;

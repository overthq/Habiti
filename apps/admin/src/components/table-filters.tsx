import * as React from 'react';
import { X, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select';

interface FilterBarProps {
	children: React.ReactNode;
	hasActiveFilters?: boolean;
	onClearFilters?: () => void;
}

export function FilterBar({
	children,
	hasActiveFilters,
	onClearFilters
}: FilterBarProps) {
	return (
		<div className='flex flex-wrap items-center gap-2 pb-4'>
			{children}
			{hasActiveFilters && onClearFilters && (
				<Button
					variant='ghost'
					size='sm'
					onClick={onClearFilters}
					className='h-8 px-2 lg:px-3'
				>
					Clear filters
					<X className='ml-2 h-4 w-4' />
				</Button>
			)}
		</div>
	);
}

interface SearchInputProps {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	className?: string;
	debounceMs?: number;
}

export function SearchInput({
	value,
	onChange,
	placeholder = 'Search...',
	className,
	debounceMs = 300
}: SearchInputProps) {
	const [localValue, setLocalValue] = React.useState(value);
	const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

	React.useEffect(() => {
		setLocalValue(value);
	}, [value]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = e.target.value;
		setLocalValue(newValue);

		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}

		timeoutRef.current = setTimeout(() => {
			onChange(newValue);
		}, debounceMs);
	};

	React.useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, []);

	return (
		<div className={`relative ${className ?? ''}`}>
			<Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
			<Input
				placeholder={placeholder}
				value={localValue}
				onChange={handleChange}
				className='pl-8 h-8 w-[150px] lg:w-[200px]'
			/>
		</div>
	);
}

interface SelectFilterProps<T extends string> {
	value: T | undefined;
	onChange: (value: T | undefined) => void;
	options: { label: string; value: T }[];
	placeholder?: string;
	className?: string;
}

export function SelectFilter<T extends string>({
	value,
	onChange,
	options,
	placeholder = 'Select...',
	className
}: SelectFilterProps<T>) {
	return (
		<Select
			value={value ?? '__all__'}
			onValueChange={v => onChange(v === '__all__' ? undefined : (v as T))}
		>
			<SelectTrigger className={`h-8 w-[130px] ${className ?? ''}`}>
				<SelectValue placeholder={placeholder} />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value='__all__'>All</SelectItem>
				{options.map(option => (
					<SelectItem key={option.value} value={option.value}>
						{option.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}

interface SortOption {
	label: string;
	value: string;
}

interface SortSelectProps {
	value: { field: string; direction: 'asc' | 'desc' } | undefined;
	onChange: (
		value: { field: string; direction: 'asc' | 'desc' } | undefined
	) => void;
	options: SortOption[];
	placeholder?: string;
	className?: string;
}

export function SortSelect({
	value,
	onChange,
	options,
	placeholder = 'Sort by...',
	className
}: SortSelectProps) {
	const combinedValue = value ? `${value.field}:${value.direction}` : '';

	const handleChange = (v: string) => {
		if (v === '') {
			onChange(undefined);
		} else {
			const [field, direction] = v.split(':');
			onChange({ field, direction: direction as 'asc' | 'desc' });
		}
	};

	// Generate options for both asc and desc
	const sortOptions = options.flatMap(opt => [
		{ label: `${opt.label} (A-Z)`, value: `${opt.value}:asc` },
		{ label: `${opt.label} (Z-A)`, value: `${opt.value}:desc` }
	]);

	return (
		<Select value={combinedValue} onValueChange={handleChange}>
			<SelectTrigger className={`h-8 w-[180px] ${className ?? ''}`}>
				<SelectValue placeholder={placeholder} />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value='__all__'>Default</SelectItem>
				{sortOptions.map(option => (
					<SelectItem key={option.value} value={option.value}>
						{option.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}

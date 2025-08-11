import * as React from 'react';
import { cn } from '@/lib/utils';

export interface DescriptionItem {
	label: string;
	value: React.ReactNode;
}

export interface DescriptionListProps {
	items: DescriptionItem[];
	className?: string;
}

export const DescriptionList: React.FC<DescriptionListProps> = ({
	items,
	className
}) => {
	return (
		<div className={cn('rounded-md border bg-background', className)}>
			<dl className='divide-y'>
				{items.map((item, index) => (
					<div
						key={index}
						className='grid grid-cols-1 gap-1 px-4 py-3 sm:grid-cols-3 sm:gap-4'
					>
						<dt className='text-sm text-muted-foreground'>{item.label}</dt>
						<dd className='sm:col-span-2 text-sm min-w-0'>{item.value}</dd>
					</div>
				))}
			</dl>
		</div>
	);
};

export default DescriptionList;

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InlineMetaProps {
	items: Array<React.ReactNode | false | null | undefined>;
	className?: string;
}

export const InlineMeta: React.FC<InlineMetaProps> = ({ items, className }) => {
	const valid = items.filter(Boolean) as React.ReactNode[];
	if (valid.length === 0) return null;
	return (
		<div
			className={cn(
				'flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted-foreground',
				className
			)}
		>
			{valid.map((item, index) => (
				<React.Fragment key={index}>
					{index > 0 && <span className='opacity-50'>•</span>}
					<span className='truncate'>{item}</span>
				</React.Fragment>
			))}
		</div>
	);
};

export default InlineMeta;

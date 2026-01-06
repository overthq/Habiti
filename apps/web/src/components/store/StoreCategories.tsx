'use client';

import React from 'react';
import { StoreProductCategory } from '@/data/types';
import { cn } from '@/lib/utils';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface StoreCategoriesProps {
	categories: StoreProductCategory[];
	selectedCategory: string | null;
	onCategoryChange: (categoryId: string | null) => void;
}

const StoreCategories: React.FC<StoreCategoriesProps> = ({
	categories,
	selectedCategory,
	onCategoryChange
}) => {
	if (categories.length === 0) {
		return null;
	}

	return (
		<ScrollArea className='w-full whitespace-nowrap'>
			<div className='flex gap-4'>
				<button
					onClick={() => onCategoryChange(null)}
					className={cn(
						'transition-colors shrink-0',
						selectedCategory === null
							? 'text-foreground'
							: 'text-muted-foreground hover:text-foreground'
					)}
				>
					All
				</button>

				{categories.map(category => (
					<button
						key={category.id}
						onClick={() => onCategoryChange(category.id)}
						className={cn(
							'transition-colors shrink-0',
							selectedCategory === category.id
								? 'text-foreground'
								: 'text-muted-foreground hover:text-foreground'
						)}
					>
						{category.name}
					</button>
				))}
			</div>
			<ScrollBar orientation='horizontal' className='invisible' />
		</ScrollArea>
	);
};

export default StoreCategories;

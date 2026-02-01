'use client';

import React from 'react';
import { StoreProductCategory } from '@/data/types';
import { cn } from '@/lib/utils';

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
		<div className='flex gap-4'>
			<button
				onClick={() => onCategoryChange(null)}
				className={cn(
					'transition-colors shrink-0 cursor-pointer',
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
						'transition-colors shrink-0 cursor-pointer',
						selectedCategory === category.id
							? 'text-foreground'
							: 'text-muted-foreground hover:text-foreground'
					)}
				>
					{category.name}
				</button>
			))}
		</div>
	);
};

export default StoreCategories;

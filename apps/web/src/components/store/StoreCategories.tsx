import { ChevronDown } from 'lucide-react';
import React from 'react';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import type { StoreProductCategory } from '@habiti/data';
import { cn } from '@/lib/utils';

interface StoreCategoriesProps {
	categories: StoreProductCategory[];
	selectedCategory: string | null;
	onCategoryChange: (categoryId: string | null) => void;
}

const MAX_LINES = 2;

const StoreCategories: React.FC<StoreCategoriesProps> = ({
	categories,
	selectedCategory,
	onCategoryChange
}) => {
	const containerRef = React.useRef<HTMLDivElement>(null);
	const measureRef = React.useRef<HTMLDivElement>(null);
	const options = React.useMemo<{ id: string | null; name: string }[]>(
		() => [
			{ id: null, name: 'All' },
			...categories.map(c => ({ id: c.id, name: c.name }))
		],
		[categories]
	);
	const [visibleCount, setVisibleCount] = React.useState(options.length);

	// Every option is rendered once in an invisible single-line row so its width
	// is known, then the wrap is simulated to find how many options fit within
	// MAX_LINES while still leaving room for the "More" button.
	React.useLayoutEffect(() => {
		const container = containerRef.current;
		const measure = measureRef.current;
		if (!container || !measure) return;

		const compute = () => {
			const available = container.clientWidth;
			const style = getComputedStyle(container);
			const gap = parseFloat(style.columnGap) || 0;
			const widths = Array.from(measure.children).map(child =>
				Math.min(child.getBoundingClientRect().width, available)
			);
			const moreWidth = widths.pop() ?? 0;

			const fits = (count: number, withMore: boolean) => {
				const items = widths.slice(0, count);
				if (withMore) items.push(moreWidth);

				let lines = 1;
				let x = 0;
				for (const width of items) {
					if (x > 0 && x + gap + width > available) {
						lines++;
						x = width;
					} else {
						x += x > 0 ? gap + width : width;
					}
				}
				return lines <= MAX_LINES;
			};

			if (fits(widths.length, false)) {
				setVisibleCount(widths.length);
				return;
			}

			let count = widths.length - 1;
			while (count > 1 && !fits(count, true)) count--;
			setVisibleCount(count);
		};

		compute();
		const observer = new ResizeObserver(compute);
		observer.observe(container);
		observer.observe(measure);
		return () => observer.disconnect();
	}, [options]);

	if (categories.length === 0) {
		return null;
	}

	const visible = options.slice(0, visibleCount);
	const overflow = options.slice(visibleCount);
	const isOverflowSelected = overflow.some(o => o.id === selectedCategory);

	const optionClassName = (selected: boolean) =>
		cn(
			'max-w-full truncate transition-colors cursor-pointer',
			selected
				? 'text-foreground'
				: 'text-muted-foreground hover:text-foreground'
		);

	return (
		<div ref={containerRef} className='relative flex flex-wrap gap-x-4 gap-y-2'>
			<div aria-hidden className='invisible absolute size-0 overflow-hidden'>
				<div ref={measureRef} className='flex w-max gap-x-4 whitespace-nowrap'>
					{options.map(option => (
						<span key={option.id ?? 'all'}>{option.name}</span>
					))}
					<MoreLabel />
				</div>
			</div>

			{visible.map(option => (
				<button
					key={option.id ?? 'all'}
					type='button'
					onClick={() => onCategoryChange(option.id)}
					className={optionClassName(selectedCategory === option.id)}
				>
					{option.name}
				</button>
			))}

			{overflow.length > 0 && (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<button
							type='button'
							className={optionClassName(isOverflowSelected)}
						>
							<MoreLabel />
						</button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align='start' className='w-auto max-h-80'>
						<DropdownMenuRadioGroup
							value={selectedCategory ?? ''}
							onValueChange={onCategoryChange}
						>
							{overflow.map(option => (
								<DropdownMenuRadioItem
									key={option.id ?? 'all'}
									value={option.id ?? ''}
								>
									{option.name}
								</DropdownMenuRadioItem>
							))}
						</DropdownMenuRadioGroup>
					</DropdownMenuContent>
				</DropdownMenu>
			)}
		</div>
	);
};

const MoreLabel = () => (
	<span className='inline-flex items-center gap-1'>
		More
		<ChevronDown className='size-4' />
	</span>
);

export default StoreCategories;

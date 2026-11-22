import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';

import { cn } from '@/lib/utils';

interface RailProps {
	label: string;
	// Extends the rail into the page's horizontal padding, so items scroll to the
	// viewport edge on mobile while staying aligned with the content column.
	bleed?: boolean;
	className?: string;
}

const FADE = '32px';

const Rail: React.FC<React.PropsWithChildren<RailProps>> = ({
	label,
	bleed = false,
	className,
	children
}) => {
	const scrollerRef = React.useRef<HTMLDivElement>(null);
	const [canScrollPrev, setCanScrollPrev] = React.useState(false);
	const [canScrollNext, setCanScrollNext] = React.useState(false);
	const childCount = React.Children.count(children);

	React.useEffect(() => {
		const scroller = scrollerRef.current;
		if (!scroller) return;

		const update = () => {
			setCanScrollPrev(scroller.scrollLeft > 1);
			setCanScrollNext(
				scroller.scrollLeft + scroller.clientWidth < scroller.scrollWidth - 1
			);
		};

		update();
		scroller.addEventListener('scroll', update, { passive: true });

		// scrollWidth changes don't trigger a resize on the scroller itself, so
		// the items are observed too (e.g. images loading, fonts swapping).
		const observer = new ResizeObserver(update);
		observer.observe(scroller);
		for (const item of scroller.children) observer.observe(item);

		return () => {
			scroller.removeEventListener('scroll', update);
			observer.disconnect();
		};
	}, [childCount]);

	const scrollPage = (direction: 1 | -1) => {
		const scroller = scrollerRef.current;
		if (!scroller) return;

		const style = getComputedStyle(scroller);
		const paddingLeft = parseFloat(style.paddingLeft);
		const visibleWidth =
			scroller.clientWidth - paddingLeft - parseFloat(style.paddingRight);
		const items = Array.from(scroller.children) as HTMLElement[];
		const itemStart = (item: HTMLElement) => item.offsetLeft - paddingLeft;

		let target: number;

		if (direction === 1) {
			// Bring the first item that isn't fully visible to the start.
			const visibleEnd = scroller.scrollLeft + visibleWidth;
			const next = items.find(
				item => itemStart(item) + item.offsetWidth > visibleEnd + 1
			);
			target = next ? itemStart(next) : scroller.scrollWidth;
		} else {
			// Go back a page, landing on an item start without overshooting it.
			const pageStart = scroller.scrollLeft - visibleWidth;
			const prev = items.find(item => itemStart(item) >= pageStart - 1);
			target = prev ? itemStart(prev) : 0;
		}

		scroller.scrollTo({ left: target, behavior: 'smooth' });
	};

	const maskImage =
		canScrollPrev || canScrollNext
			? `linear-gradient(to right, ${canScrollPrev ? 'transparent' : 'black'}, black ${FADE}, black calc(100% - ${FADE}), ${canScrollNext ? 'transparent' : 'black'})`
			: undefined;

	return (
		<div
			role='region'
			aria-label={label}
			className={cn('relative', bleed && '-mx-4')}
		>
			<div
				ref={scrollerRef}
				className={cn(
					'flex gap-4 overflow-x-auto overscroll-x-contain scrollbar-none snap-x snap-mandatory *:shrink-0 *:snap-start',
					bleed && 'px-4 scroll-px-4',
					className
				)}
				style={{ maskImage, WebkitMaskImage: maskImage }}
			>
				{children}
			</div>

			<RailButton
				direction={-1}
				visible={canScrollPrev}
				onClick={() => scrollPage(-1)}
			/>
			<RailButton
				direction={1}
				visible={canScrollNext}
				onClick={() => scrollPage(1)}
			/>
		</div>
	);
};

interface RailButtonProps {
	direction: 1 | -1;
	visible: boolean;
	onClick: () => void;
}

const RailButton: React.FC<RailButtonProps> = ({
	direction,
	visible,
	onClick
}) => {
	const Icon = direction === 1 ? ChevronRight : ChevronLeft;

	return (
		<button
			type='button'
			aria-label={direction === 1 ? 'Scroll forward' : 'Scroll back'}
			// Keyboard users already reach every item by tabbing through it, and touch
			// users swipe, so the arrows are only for precise pointers.
			tabIndex={-1}
			onClick={onClick}
			className={cn(
				'absolute top-1/2 -translate-y-1/2 z-10 hidden pointer-fine:flex size-9 items-center justify-center rounded-full border bg-background/90 shadow-sm backdrop-blur transition-opacity cursor-pointer hover:bg-background',
				direction === 1 ? 'right-1' : 'left-1',
				visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
			)}
		>
			<Icon className='size-4' />
		</button>
	);
};

export default Rail;

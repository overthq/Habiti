const Hero = () => {
	return (
		<section className='flex flex-col justify-center grow py-16'>
			<div className='max-w-2xl'>
				<h1 className='text-4xl md:text-5xl font-semibold tracking-tight'>
					Online shopping, simplified.
				</h1>
				<p className='mt-3 text-lg text-muted-foreground'>
					Habiti helps shoppers and merchants manage their shopping activity in
					one place.
				</p>
				<div className='mt-6 flex items-center gap-3'>
					<a
						href='https://forms.gle/VXQjP7gcMJvgZivA6'
						target='_blank'
						rel='noopener noreferrer'
						className='inline-flex h-10 items-center rounded-md bg-foreground px-5 text-sm font-medium text-background hover:bg-foreground/90'
					>
						Request access
					</a>
					<a
						href='/about'
						className='text-sm text-muted-foreground hover:text-foreground'
					>
						Learn more
					</a>
				</div>
			</div>
		</section>
	);
};

export default Hero;

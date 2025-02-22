const Hero = () => {
	return (
		<div className='flex flex-col justify-center grow py-4'>
			<h1 className='text-4xl font-semibold'>Online shopping, simplified.</h1>
			<p className='mt-2 text-lg'>
				Habiti helps shoppers and merchants manage their shopping activity in
				one place.
			</p>
			<div>
				<a
					href='https://forms.gle/VXQjP7gcMJvgZivA6'
					target='_blank'
					rel='noopener noreferrer'
				>
					<button className='mt-6 px-6 py-3 bg-[#2D2D2D] rounded text-white text-lg font-medium cursor-pointer'>
						Request access
					</button>
				</a>
			</div>
		</div>
	);
};

export default Hero;

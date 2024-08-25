const Hero = () => {
	return (
		<div className='text-center flex flex-col justify-center grow p-4'>
			<h1 style={{ fontSize: '2.8125rem', fontWeight: '700' }}>
				Online shopping, simplified.
			</h1>
			<p style={{ marginTop: 16, fontSize: '1.2rem' }}>
				Habiti helps shoppers and merchants manage their shopping activity in
				one place.
			</p>
			<div>
				<a
					href='https://forms.gle/VXQjP7gcMJvgZivA6'
					target='_blank'
					rel='noopener noreferrer'
				>
					<button className='mt-4 px-6 py-3 bg-[#2D2D2D] rounded text-white text-lg font-medium cursor-pointer'>
						Request access
					</button>
				</a>
			</div>
		</div>
	);
};

export default Hero;

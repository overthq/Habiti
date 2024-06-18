const Hero = () => {
	return (
		<div style={{ padding: '100px 0', textAlign: 'center' }}>
			<h1 style={{ fontSize: '2.8125rem', fontWeight: '700' }}>
				Online shopping, simplified.
			</h1>
			<p style={{ marginTop: 16, fontSize: '1.2rem' }}>
				Habiti helps shoppers and merchants manage their shopping activity in
				one place.
			</p>
			<a
				href='https://forms.gle/VXQjP7gcMJvgZivA6'
				target='_blank'
				rel='noopener noreferrer'
			>
				<button
					style={{
						fontFamily: 'Inter',
						marginTop: 16,
						padding: '12px 24px',
						backgroundColor: '#108910',
						borderRadius: 4,
						color: '#FFFFFF',
						fontSize: '1.1rem',
						fontWeight: '500',
						border: 'none',
						cursor: 'pointer'
					}}
				>
					Request access
				</button>
			</a>
		</div>
	);
};

export default Hero;

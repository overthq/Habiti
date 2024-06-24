const Hero = () => {
	return (
		<div
			style={{
				textAlign: 'center',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				flexGrow: 1,
				padding: '0 16px'
			}}
		>
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
					<button
						style={{
							marginTop: 16,
							padding: '12px 24px',
							backgroundColor: '#2D2D2D',
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

			<div
				style={{
					marginTop: 32,
					display: 'flex',
					gap: 16,
					justifyContent: 'center'
				}}
			></div>
		</div>
	);
};

export default Hero;

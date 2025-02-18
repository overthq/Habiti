const AcceptableUse = () => {
	return (
		<div className='container flex flex-col flex-1 py-8 gap-3'>
			<h1 className='scroll-m-20 text-4xl font-semibold tracking-tight mb-4'>
				Acceptable Use Policy (AUP)
			</h1>
			<p>
				We value the trust you place in us to help you manage your online stores
				as merchants, and your shopping activity as shoppers. To ensure the
				continued safety and integrity of our platform and protect our user
				base, we demand that the services we provide are used responsibly.
			</p>
			<p>
				You agree to not abuse the Habiti services (”Services”) or help anyone
				else do so. For example, you must not attempt to do any of the following
				in connection with the Services:
			</p>
			<ul className='list-disc pl-4 py-2'>
				<li>
					probe, scan or test the vulnerability of any system or network;{' '}
				</li>
				<li>
					breach or otherwise circumvent any security or authentication
					measures;
				</li>
				<li>
					access, tamper with, or use non-public areas or parts of the Services,
					or shared areas of the Services you haven’t been invited to; - create
					or manage Stores that advertise or sell materials that constitute
					pornography, child sexually exploitative material, or are otherwise
					indecent or sexual in nature;
				</li>{' '}
				<li>
					harass or otherwise abuse Habiti employees or individuals performing
					services on the Company’s behalf;
				</li>
				<li>
					circumvent Platform fees, or engage in any form of payment fraud,
					including unauthorized usage of payment methods, or any other method
					of accessing the Services without required payment;
				</li>
				<li>
					create, promote or manage Products other than your own without
					appropriate authorization; - violate the law in any way;
				</li>
				<li>
					use the Services as infrastructure for your own product or service;
				</li>
				<li> use the Services to promote gambling or related activities;</li>
			</ul>

			<p>
				In the event of a violation of this policy, we reserve the right to take
				appropriate action, including removing stores and products, suspending
				user accounts or terminating a user or store.
			</p>
			<p>
				For clarification on any of the points outlined above, do not hesitate
				to contact us at support@habiti.app.
			</p>
		</div>
	);
};

export default AcceptableUse;

import { LoopsClient } from 'loops';
import { env } from '../config/env';

export enum EmailType {
	NewAccount = 'NewAccount'
}

const TransactionalIDByEmailType = {
	[EmailType.NewAccount]: 'cmedpo8no43ziwd0i8sboo6vf'
} as const;

interface SendMailArgs {
	emailType: EmailType;
	email: string;
	code: string; // FIXME: This should be on a discriminated union
}

// TODO: Similarly to the notifications service,
// we should queue this if possible and handle errors smartly.

export default class EmailService {
	private loops: LoopsClient;
	private isEnabled: boolean;

	constructor() {
		if (env.NODE_ENV !== 'production') {
			console.warn(
				'Email service is not enabled in non-production environment'
			);

			this.isEnabled = false;
		} else {
			if (!env.LOOPS_API_KEY) {
				throw new Error('LOOPS_API_KEY is not set');
			}

			this.loops = new LoopsClient(env.LOOPS_API_KEY);
			this.isEnabled = true;
		}
	}

	public sendMail(args: SendMailArgs) {
		if (this.isEnabled) {
			this.loops.sendTransactionalEmail({
				transactionalId: TransactionalIDByEmailType[args.emailType],
				email: args.email,
				addToAudience: true,
				dataVariables: {
					verification_code: args.code
				}
			});
		}
	}
}

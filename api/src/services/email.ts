import { LoopsClient } from 'loops';
import { env } from '../config/env';

export enum EmailType {
	NewAccount
}

const TransactionalIDByEmailType = {
	[EmailType.NewAccount]: 'cmiqvjjve0jjd2a0i2ozhln4f'
} as const;

interface SendMailArgs {
	emailType: EmailType;
	email: string;
	code: string;
}

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
				dataVariables: {
					verification_code: args.code
				}
			});
		}
	}
}

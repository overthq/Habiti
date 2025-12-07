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
	private loops: LoopsClient | null = null;

	constructor() {
		if (env.NODE_ENV === 'production') {
			if (!env.LOOPS_API_KEY) {
				throw new Error('LOOPS_API_KEY is not set');
			}

			this.loops = new LoopsClient(env.LOOPS_API_KEY);
		}
	}

	public sendMail(args: SendMailArgs) {
		this.loops?.sendTransactionalEmail({
			transactionalId: TransactionalIDByEmailType[args.emailType],
			email: args.email,
			dataVariables: {
				verification_code: args.code
			}
		});
	}
}

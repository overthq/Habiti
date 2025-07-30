import { LoopsClient } from 'loops';
import { env } from '../config/env';

export default class EmailService {
	private loops: LoopsClient;

	constructor() {
		if (env.NODE_ENV !== 'production') {
			console.warn(
				'Email service is not enabled in non-production environment'
			);
		} else {
			if (!env.LOOPS_API_KEY) {
				throw new Error('LOOPS_API_KEY is not set');
			}

			this.loops = new LoopsClient(env.LOOPS_API_KEY);
		}
	}

	public queueMail(mail: any) {}

	public sendMails() {}
}

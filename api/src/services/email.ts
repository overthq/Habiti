import { LoopsClient } from 'loops';
import { env } from '../config/env';

export default class EmailService {
	private loops: LoopsClient;

	constructor() {
		if (process.env.NODE_ENV === 'production') {
			this.loops = new LoopsClient(env.LOOPS_API_KEY);
		}
	}

	public queueMail(mail: any) {}

	public sendMails() {}
}

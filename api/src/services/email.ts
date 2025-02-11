import nodemailer from 'nodemailer';

// Probably use loops.so
export default class EmailService {
	private mails: any[];
	private transporter: ReturnType<(typeof nodemailer)['createTransport']>;

	constructor() {
		this.transporter = nodemailer.createTransport({
			host: 'smtp.ethereal.email',
			port: 587,
			secure: false, // Use `true` for port 465, `false` for all other ports
			auth: {
				user: 'maddison53@ethereal.email',
				pass: 'jn7jnAPss4f63QBp6D'
			}
		});
	}

	public queueMail(mail: any) {
		this.mails.push(mail);
	}

	public sendMails() {
		this.transporter.sendMail({
			from: '"Something something" <something@example.com>',
			to: 'example@example.com',
			subject: 'Hello world!',
			text: 'Hello world!'
			// html: '<h1>Hello world!</h1>'
		});
	}
}

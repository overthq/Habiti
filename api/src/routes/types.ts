export class APIException extends Error {
	constructor(
		public statusCode: number,
		public message: string,
		public errors?: any
	) {
		super(message);
		this.name = 'ApiException';
	}
}

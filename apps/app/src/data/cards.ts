import APIService from './api';

export class CardService {
	constructor(private api: APIService) {}

	public getCards() {
		return this.api.get('/cards');
	}
}

import APIService from './api';

export default class SearchService {
	constructor(private readonly api: APIService) {}

	async search(searchTerm: string) {
		return this.api.get('/search', { params: { searchTerm } });
	}
}

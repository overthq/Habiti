export class ReactNativeFile {
	public uri: string;
	public name: string;
	public type: string;

	constructor({ uri, name, type }: ReactNativeFile) {
		this.uri = uri;
		this.name = name;
		this.type = type;
	}
}

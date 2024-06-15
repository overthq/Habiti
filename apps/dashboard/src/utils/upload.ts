interface ReactNativeFileOptions {
	uri: string;
	name: string;
	type: string;
}

export class ReactNativeFile extends File {
	public uri: string;
	public name: string;
	public type: string;

	constructor({ uri, name, type }: ReactNativeFileOptions) {
		super([], name, { type });
		this.uri = uri;
		this.name = name;
		this.type = type;
	}
}

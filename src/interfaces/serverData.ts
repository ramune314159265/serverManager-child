export interface Run {
	command: string,
	args: Array<string>,
	cwd: string
}

export interface Server {
	run: Run,
	rootDirectory: string,
	stop: string
}

export interface ServerList {
	[key: string]: Server
}

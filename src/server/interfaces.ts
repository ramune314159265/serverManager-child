export interface RunData {
	command: string,
	args: Array<string>,
	cwd: string
}

export interface ServerData {
	id: string,
	run: RunData,
	rootDirectory: string,
	stop: string
}

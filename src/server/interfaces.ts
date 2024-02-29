export interface RunData {
	command: string,
	args: Array<string>,
	cwd: string
}

export interface ServerData {
	run: RunData,
	rootDirectory: string,
	stop: string
}

export interface ServerListData {
	[key: string]: ServerData
}

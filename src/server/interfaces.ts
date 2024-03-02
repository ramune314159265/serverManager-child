import pty from 'node-pty'

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

export const isIPty = (arg: unknown): arg is pty.IPty => {
	return typeof (arg as pty.IPty)?.onData === 'function' &&
		typeof (arg as pty.IPty)?.onExit === 'function' &&
		typeof (arg as pty.IPty)?.write === 'function'
}

import pty from 'node-pty'
import { Server } from './server'

export interface RunData {
	command: string,
	args: Array<string>,
	cwd: string
}

export interface ServerData {
	id: string,
	run: RunData,
	rootDirectory: string,
	stopHandle: (server: Server) => void
}

export const isIPty = (arg: unknown): arg is pty.IPty => {
	return typeof (arg as pty.IPty)?.onData === 'function' &&
		typeof (arg as pty.IPty)?.onExit === 'function' &&
		typeof (arg as pty.IPty)?.write === 'function'
}

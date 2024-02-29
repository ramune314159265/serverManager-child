import pty from 'node-pty'
import { ServerData } from './interfaces'

export class Server {
	process: pty.IPty | null
	processData: ServerData

	constructor(processData: ServerData) {
		this.process = null
		this.processData = processData
	}
	start() {
		if (this.process !== null) {
			throw new Error('プロセスはすでに起動しています')
		}

		this.process = pty.spawn(this.processData.run.command, this.processData.run.args, {
			name: 'xterm-color',
			cols: 80,
			rows: 24,
			cwd: this.processData.rootDirectory
		})
	}
}

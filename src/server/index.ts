import pty from 'node-pty'
import { ServerData } from './interfaces'

export class Server {
	id: string
	process: pty.IPty | null
	processData: ServerData

	constructor(serverId: string, processData: ServerData) {
		this.id = serverId
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
			cwd: this.processData.run.cwd
		})
		this.process.onExit(() => {
			this.process = null
		})
	}
	stop() {
		if (this.process === null) {
			throw new Error('プロセスが起動していません')
		}

		this.processData.stopHandle()
	}
	hardStop() {
		if (this.process === null) {
			throw new Error('プロセスが起動していません')
		}

		try {
			process.kill(this.process.pid)
		} catch (error) {
			console.error(error)
		}

	}
}

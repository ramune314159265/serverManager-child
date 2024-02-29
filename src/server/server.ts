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
		this.process.onExit(() => {
			this.process = null
		})
	}
	stop() {
		if (this.process === null) {
			throw new Error('プロセスが起動していません')
		}

		this.process.write(this.processData.stop)
	}
	hardStop() {
		if (this.process === null) {
			throw new Error('プロセスが起動していません')
		}

		try {
			this.process.kill()
		} catch (error) {
			console.error(error)
		}

	}
}

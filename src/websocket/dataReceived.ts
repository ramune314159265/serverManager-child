import WebSocket from 'websocket'

import { servers } from '../server/index'
import { consoleSizeData, receivedData, sendData } from './interfaces'
import { isIPty } from '../server/interfaces'
import { allStop } from '../server/allstop'

export const receivedHandle = (data: receivedData, connection: WebSocket.connection) => {
	switch (data.type) {
		case 'server_start': {
			if (typeof data.serverId !== 'string') {
				return
			}
			if (!Object.hasOwn(servers, data.serverId)) {
				return
			}
			const server = servers[data.serverId]
			server.start()

			if (!isIPty(server.process)) {
				return
			}

			server.process.onData(data => {
				const dataToSend: sendData = {
					type: 'server_stdout',
					serverId: server.id,
					content: data
				}
				connection.send(JSON.stringify(dataToSend))
			})
			server.process.onExit(() => {
				const dataToSend: sendData = {
					type: 'server_stopped',
					serverId: server.id,
				}
				connection.send(JSON.stringify(dataToSend))
			})

			const dataToSend: sendData = {
				type: 'server_started',
				serverId: server.id
			}
			connection.send(JSON.stringify(dataToSend))
			const sizeData: consoleSizeData = {
				col: server.process.cols,
				row: server.process.rows
			}
			connection.send(JSON.stringify(sizeData))
		}
			break
		case 'server_write_stdin': {
			if (typeof data.serverId !== 'string') {
				return
			}
			if (!Object.hasOwn(servers, data.serverId)) {
				return
			}
			const server = servers[data.serverId]
			if (!isIPty(server.process)) {
				return
			}
			if (typeof data.content !== 'string') {
				return
			}

			server.process.write(data.content)
		}
			break
		case 'server_stop': {
			if (typeof data.serverId !== 'string') {
				return
			}
			if (!Object.hasOwn(servers, data.serverId)) {
				return
			}
			const server = servers[data.serverId]
			if (server.process === null) {
				return
			}

			server.stop()
		}
			break

		case 'server_hard_stop': {
			if (typeof data.serverId !== 'string') {
				return
			}
			if (!Object.hasOwn(servers, data.serverId)) {
				return
			}
			const server = servers[data.serverId]
			if (server.process === null) {
				return
			}

			server.hardStop()
		}
			break

		case 'stop': {
			allStop()
				.then(() => {
					connection.close()
					process.exit(0)
				})
		}
			break

		default:
			break
	}
}

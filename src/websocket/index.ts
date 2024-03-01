import WebSocket from 'websocket'
import pty from 'node-pty'

import { servers } from '..'

export const wsClient: WebSocket.client = new WebSocket.client

interface receivedData {
	type: string,
	serverId?: string,
}

interface sendData {
	type: string,
	serverId?: string,
	content?: string
}

const isIPty = (arg: unknown): arg is pty.IPty => {
	return typeof (arg as pty.IPty)?.onData === 'function' &&
		typeof (arg as pty.IPty)?.onExit === 'function'
}

wsClient.on('connect', connection => {
	connection.on('error', e => {
		console.error(e.toString())
	})

	connection.on('message', message => {
		if (message.type !== 'utf8') {
			return
		}

		const data: receivedData = JSON.parse(message.utf8Data)
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
				if (server.process !== null) {
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
				if (server.process !== null) {
					return
				}

				server.hardStop()
			}
				break

			default:
				break
		}
	})
})

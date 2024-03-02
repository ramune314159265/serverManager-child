import WebSocket from 'websocket'

import { receivedData } from './interfaces'
import { receivedHandle } from './dataReceived'

export const wsClient: WebSocket.client = new WebSocket.client

wsClient.on('connect', connection => {
	connection.on('error', e => {
		console.error(e.toString())
	})

	connection.on('message', message => {
		if (message.type !== 'utf8') {
			return
		}

		const data: receivedData = JSON.parse(message.utf8Data)

		receivedHandle(data, connection)
	})
})

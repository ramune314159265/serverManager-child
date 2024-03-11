import { serverList } from './config/serverlist'
import { configData } from './config/wsconnection'
import { Server } from './server'


export const servers: { [key: string]: Server } = {}

serverList.forEach(serverData => {
	servers[serverData.id] = new Server(serverData.id, serverData)
})

import { wsClient } from './websocket'

wsClient.connect(configData.url)

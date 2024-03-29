import { serverList } from '../config/serverlist'
import { Server } from './server'

export const servers: { [key: string]: Server } = {}

serverList.forEach(serverData => {
	servers[serverData.id] = new Server(serverData.id, serverData)
})

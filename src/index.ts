import { serverList } from './config/serverlist'
import { Server } from './server/server'

const server = new Server(serverList.test)

server.start()
server.process?.onData?.(data => console.log(data))
server.process?.onExit?.(()=>console.log('exit!!!'))

setTimeout(() => {
	server.hardStop()
}, 5000)

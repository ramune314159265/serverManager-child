import { openPortlist } from '../config/openPortlist'
import { Port } from './port'
import  './rootDevice'

export const ports: { [key: string]: Port } = {}

openPortlist.forEach(portData => {
	ports[portData.id] = new Port(portData.id, portData)
})

const autoOpenPortsIds: Array<string> = openPortlist
	.filter(portData => portData.auto)
	.map(portData => portData.id)

const autoOpenPort = async () => {
	for (let i = 0; i < autoOpenPortsIds.length; i++) {
		await ports[autoOpenPortsIds[i]].open()
		console.log(ports[autoOpenPortsIds[i]].port, ports[autoOpenPortsIds[i]].protocol)
	}
}

autoOpenPort()

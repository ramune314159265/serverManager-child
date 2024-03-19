import { openPortlist } from '../config/openPortlist'
import { Port } from './port'

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
	}
}

autoOpenPort()

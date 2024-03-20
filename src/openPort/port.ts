import NatAPI from '@silentbot1/nat-api'
import { portData } from './interfaces'
import { addPortMap, removePortMap } from './rootDevice'

export class Port {
	static client = new NatAPI({
		gateway: '192.168.0.1',
		enablePMP: true,
		enableUPNP: true,
		upnpPermanentFallback: false
	})
	id: string
	port: number
	protocol: string
	isAuto: boolean
	isOpening: boolean
	constructor(portId: string, portInfo: portData) {
		this.id = portId
		this.port = portInfo.port
		this.protocol = portInfo.protocol
		this.isAuto = portInfo.auto
		this.isOpening = false
	}
	async open() {
		await addPortMap(this.port, this.protocol, 43200)
		this.isOpening = true
	}
	async close() {
		await removePortMap(this.port, this.protocol)
		this.isOpening = false
	}
}

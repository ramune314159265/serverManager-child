import NatAPI from '@silentbot1/nat-api'
import { portData } from './interfaces'

export class Port {
	static client = new NatAPI({
		gateway: '192.168.0.1'
	})
	id: string
	port: number
	protocol: string
	isAuto: boolean
	constructor(portId: string, portInfo: portData) {
		this.id = portId
		this.port = portInfo.port
		this.protocol = portInfo.protocol
		this.isAuto = portInfo.auto
	}
	async open() {
		await Port.client.map({
			publicPort: this.port,
			privatePort: this.port,
			protocol: this.protocol
		})
	}
	async close(){
		await Port.client.unmap({
			publicPort: this.port,
			privatePort: this.port,
			protocol: this.protocol
		})
	}
}

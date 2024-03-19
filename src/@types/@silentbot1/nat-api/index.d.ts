declare module '@silentbot1/nat-api' {
	interface INatAPIOptions {
		ttl?: number,
		autoUpdate?: boolean,
		gateway?: string,
		enablePMP?: boolean,
		enableUPNP?: boolean,
		upnpPermanentFallback?: boolean
	}
	interface IPortOptions {
		publicPort: number
		privatePort: number
		protocol: string | null
		ttl?: number
		description?: string
	}

	export default class NatAPI {
		constructor(opts: INatAPIOptions)
		map(port: number): Promise<void>
		map(publicPort: number, privatePort: number): Promise<void>
		map(opts: IPortOptions): Promise<void>
		unmap(port: number): Promise<void>
		unmap(publicPort: number, privatePort: number): Promise<void>
		unmap(opts: IPortOptions): Promise<void>
		externalIp(): Promise<string>
		destroy(): Promise<void>
	}
}

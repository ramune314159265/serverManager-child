import { networkInterfaces } from "os"
import ssdp from 'node-ssdp'
import xmlConverter from 'xml-js'
import { rootDeviceConfig } from '../config/openPort'

export const getLocalIpAddress = (): (string | null) => {
	const mainNetwork = Object.values(networkInterfaces())[0]
	const ipv4Network = mainNetwork?.filter(network => network.family === 'IPv4')
	if (!ipv4Network) {
		return null
	}
	return ipv4Network[0].address
}

export const searchControlUrl = (json: string) => {
	const data = JSON.parse(json)
	// device.serviceList.service.serviceTypeが特定のやつじゃなかったらdevice.deviceList.device.serviceList.service.serviceType...のように再帰的に検索する
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const search = (device: any): string => {
		const serviceType = device.serviceList.service.serviceType._text
		if (serviceType === 'urn:schemas-upnp-org:service:WANIPConnection:1' || serviceType === 'urn:schemas-upnp-org:service:WANPPPConnection:1') {
			return device.serviceList.service.controlURL._text
		} else {
			return search(device.deviceList.device)
		}
	}
	return search(data.root.device)
}

export const discoverRootDeviceLocation = (): Promise<string | undefined> => {
	if (rootDeviceConfig.documentUrl) {
		return new Promise((resolve) => { resolve(rootDeviceConfig.documentUrl) })
	}
	const client = new ssdp.Client({})

	return new Promise((resolve, reject) => {
		client.on('response', (headers) => {
			console.log(headers)
			resolve(headers.LOCATION)
		})

		client.search('upnp:rootdevice')

		setTimeout(reject, 5000)
	})
}

export const getRootDeviceInfo = async (url: string) => {
	const xml = await (await fetch(url)).text()
	return xmlConverter.xml2json(xml, { compact: true })
}

const rootDeviceUrl = await discoverRootDeviceLocation()

//https://hp.vector.co.jp/authors/VA011804/upnp.htm
export const addPortMap = async (port: number, protocol: string, durariton: number = 0) => {
	if (!rootDeviceUrl) {
		return
	}
	const controlUrlPath = searchControlUrl(await getRootDeviceInfo(rootDeviceUrl))
	const url = new URL(rootDeviceUrl).origin + controlUrlPath
	const text = `
<?xml version="1.0"?>
<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
	<s:Body>
		<u:AddPortMapping xmlns:u="urn:schemas-upnp-org:service:WANIPConnection:1">
			<NewRemoteHost></NewRemoteHost>
			<NewExternalPort>${port}</NewExternalPort>
			<NewProtocol>${protocol}</NewProtocol>
			<NewInternalPort>${port}</NewInternalPort>
			<NewInternalClient>${getLocalIpAddress()}</NewInternalClient>
			<NewEnabled>1</NewEnabled>
			<NewPortMappingDescription>port map</NewPortMappingDescription>
			<NewLeaseDuration>${durariton}</NewLeaseDuration>
		</u:AddPortMapping>
	</s:Body>
</s:Envelope>
	`.trim()
	const headers = new Headers()
	headers.append('SOAPACTION', 'urn:schemas-upnp-org:service:WANIPConnection:1#AddPortMapping')
	return await (await fetch(url, { headers, method: 'POST', body: text })).text()
}

export const removePortMap = async (port: number, protocol: string) => {
	if (!rootDeviceUrl) {
		return
	}
	const controlUrlPath = searchControlUrl(await getRootDeviceInfo(rootDeviceUrl))
	const url = new URL(rootDeviceUrl).origin + controlUrlPath
	const text = `
<?xml version="1.0"?>
<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
	<s:Body>
		<u:DeletePortMapping  xmlns:u="urn:schemas-upnp-org:service:WANIPConnection:1">
			<NewRemoteHost></NewRemoteHost>
			<NewExternalPort>${port}</NewExternalPort>
			<NewProtocol>${protocol}</NewProtocol>
			<NewInternalPort>${port}</NewInternalPort>
		</u:DeletePortMapping>
	</s:Body>
</s:Envelope>
	`.trim()
	const headers = new Headers()
	headers.append('SOAPACTION', 'urn:schemas-upnp-org:service:WANPPPConnection:1#DeletePortMapping')
	return await (await fetch(url, { headers, method: 'POST', body: text })).text()
}

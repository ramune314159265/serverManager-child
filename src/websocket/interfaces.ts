export interface wsConfig {
	url: string
}

export interface receivedData {
	type: string,
	serverId?: string,
	content?: string
}

export interface sendData {
	type: string,
	serverId?: string,
	content?: string
}

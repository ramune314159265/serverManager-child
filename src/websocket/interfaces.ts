export interface config {
	url: string,
	id: string
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

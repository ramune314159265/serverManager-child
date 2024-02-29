import { ServerData } from '../server/interfaces'

export const serverList: Array<ServerData> = [
	{
		id: 'test',
		run: {
			command: "powershell.exe",
			args: [],
			cwd: "D:/servers/minecraft_ramune/proxy"
		},
		stop: 'exit\r',
		rootDirectory: 'D:/servers/minecraft_ramune/proxy'
	}
] as const

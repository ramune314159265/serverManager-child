import { ServerListData } from '../server/interfaces'

export const serverList: ServerListData = {
	test: {
		run: {
			command: "powershell.exe",
			args: [],
			cwd: "D:/servers/minecraft_ramune/proxy"
		},
		stop: 'stop\r',
		rootDirectory: 'D:/servers/minecraft_ramune/proxy'
	}
} as const

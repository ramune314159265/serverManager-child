import { ServerList } from '../interfaces/serverData'

export const serverList: ServerList = {
	proxy: {
		run: {
			command: "java.exe",
			args: ["-Xmx512M", "-Xms512M", "-jar", "proxy.jar"],
			cwd: "D:/servers/minecraft_ramune/proxy"
		},
		stop: 'stop\r',
		rootDirectory: 'D:/servers/minecraft_ramune/proxy'
	}
} as const

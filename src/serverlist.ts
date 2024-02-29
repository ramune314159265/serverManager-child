interface Run {
	command: string,
	args: Array<string>,
	cwd: string
}

interface Server {
	run: Run,
	rootDirectory: string,
	stop: string
}

interface ServerList {
	[key: string]: Server
}

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

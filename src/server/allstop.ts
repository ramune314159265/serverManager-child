import { isIPty } from './interfaces'
import { servers } from '..'

export const allStop = () => {
	const serverStopPromises = []

	for (const server of Object.values(servers)) {
		if (!isIPty(server.process)) {
			continue
		}

		server.stop()
		const serverStopPromise = new Promise<void>((resolve) => {
			server?.process?.onExit(() => {
				resolve()
			})
		})
		serverStopPromises.push(serverStopPromise)
	}

	return Promise.all(serverStopPromises)
}

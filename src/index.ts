import { wsConfigData } from './config/wsconnection'
import { wsClient } from './websocket'

wsClient.connect(wsConfigData.url)

process.on('uncaughtException', err => console.error('uncaughtException:', err))

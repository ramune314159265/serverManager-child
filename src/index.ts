import './websocket/index'
import './server/index'
import './openPort/index'

process.on('uncaughtException', err => console.error('uncaughtException:', err))

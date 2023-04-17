import { createLogger, format, transports } from 'winston'
const { printf, combine, timestamp } = format

export const serverLogger = createLogger({
    level: 'info',
    format: combine(
        timestamp(),
        printf(info => `${info.timestamp} [${info.level}]: ${info.message}`)
    ),
    transports: [new transports.Console()]
})

export type LoggingFunction = (time: string, context: string, args: any[]) => void

export const info: LoggingFunction = (time: string, context: string, args: any[]) => {
    console.group(`%c ${time} INFO [${context}]`, "color:#60a5fa")
    for (const argument of args) {
        console.log(argument)
    }
    console.groupEnd()
}

export const error: LoggingFunction = (time: string, context: string, args: any[]) => {
    console.group(`%c ${time} ERROR in [${context}]`, "color:#f43f5e")
    console.count('ERROR Count')
    for (const argument of args) {
        console.log(argument)
    }
    console.groupEnd()
}

const logger = (functionLevel: LoggingFunction, context: string, ...args: any[]) => {
    const time = new Date().toLocaleTimeString()
    functionLevel(time, context, args)
}

export default logger

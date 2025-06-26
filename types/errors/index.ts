type ErrorRecord = Record<string, { message: string }>

export interface ICustomError extends Error {
	statusCode?: number
	code?: number
	errors?: ErrorRecord
}

interface IMongooseError extends Error {
	name: string
	code?: number
	errors?: ErrorRecord
}

export type ErrorType = Error | IMongooseError | ICustomError

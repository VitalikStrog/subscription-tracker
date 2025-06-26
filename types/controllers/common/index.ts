type ResponseBodyBase = {
	success: boolean
	message: string
}

export type ResponseBody<DataType = undefined> = DataType extends undefined
	? ResponseBodyBase
	: ResponseBodyBase & { data: DataType }

export type ErrorResponseBody = { error: string }

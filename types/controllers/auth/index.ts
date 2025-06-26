import { UserType } from '../../models/user'
import { ResponseBody } from '../common'

export type SignUpRequestBody = {
	name: string
	email: string
	password: string
}

export type SignUpInResponseBody = ResponseBody<UserType>

export type SignInRequestBody = {
	email: string
	password: string
}

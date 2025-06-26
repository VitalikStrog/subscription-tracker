import { ResponseBody } from '../common'
import { UserWithRole } from '../../models'

export type GetUsersResponseBody = ResponseBody<UserWithRole[]>

export type GetUserParams = {
	id: string
}

export type GetUserResponseBody = ResponseBody<UserWithRole>

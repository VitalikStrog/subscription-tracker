import { Roles } from '../../models'

export interface CreateUserData {
	name: string
	email: string
	password: string
	role: Roles
}

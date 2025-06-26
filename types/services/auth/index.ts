import { UserWithRole } from '../../models'

export interface LoginCredentials {
	email: string
	password: string
}

export interface TokenPayload {
	userId: string
	email: string
}

export interface AuthResult {
	user: UserWithRole
	token: string
}

import { UserWithRole } from './models'

declare global {
	namespace Express {
		interface Request {
			user?: UserWithRole
		}
	}
}

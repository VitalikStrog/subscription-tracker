import { ICustomError, Roles } from '../types'
import { RequestHandler } from 'express'
import Role from '../models/role.model'

const requireRole = (requiredRole: Roles): RequestHandler => {
	return async (req, res, next) => {
		const sendForbiddenResponse = (error?: string) => {
			res.status(403).json({
				message: 'Access denied. Insufficient permissions.',
				error
			})

			return
		}

		try {
			if (!req.user) {
				res.status(401).json({ message: 'Authentication required' })
				return
			}

			const user = req.user
			const userRole = user.role

			if (!userRole) {
				sendForbiddenResponse('Invalid user role')

				return
			}

			const role = await Role.findOne({ name: user.role })

			if (!role) {
				sendForbiddenResponse('User role not found')

				return
			}

			if (userRole !== requiredRole) {
				sendForbiddenResponse(`${requiredRole} role required`)

				return
			}

			next()
		} catch (error) {
			sendForbiddenResponse((error as ICustomError)?.message)
		}
	}
}

export default requireRole

import { RequestHandler } from 'express'
import { ICustomError, UserWithObjectRole, UserWithRole } from '../types'
import jwt, { JwtPayload } from 'jsonwebtoken'
import User from '../models/user.model'

const authorize: RequestHandler = async (req, res, next) => {
	const sentUnauthorizedResponse = (error?: string) => {
		res.status(401).json({ message: 'Unauthorized', error })
	}

	try {
		const token = req.cookies.token

		if (!token) {
			return sentUnauthorizedResponse()
		}

		const decoded = jwt.verify(token!, process.env.JWT_SECRET!) as JwtPayload

		const user = (await User.findById(decoded.userId)
			.populate('role')
			.select('-password')) as UserWithObjectRole

		if (!user) {
			return sentUnauthorizedResponse()
		}

		req.user = {
			...user.toObject({ flattenObjectIds: true }),
			role: user.role.name
		} as UserWithRole

		next()
	} catch (error) {
		sentUnauthorizedResponse((error as ICustomError)?.message)
	}
}

export default authorize

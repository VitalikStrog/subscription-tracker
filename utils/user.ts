import { UserType, UserWithObjectRole, UserWithRole } from '../types'
import User from '../models/user.model'
import CustomError from './custom-error'

export const populateUserWithRole = async (
	user: UserType | UserWithObjectRole | null
): Promise<UserWithRole> => {
	try {
		if (!user) {
			throw new Error('User not found')
		}

		if (!user.populated('role')) {
			await user.populate('role')
		}

		const userWithRole = user as UserWithObjectRole

		if (!userWithRole.role || !userWithRole.role.name) {
			throw new Error('Failed to populate user role')
		}

		return {
			...userWithRole.toObject(),
			role: userWithRole.role.name
		}
	} catch (error) {
		throw new Error(`Error populating user role: ${error}`)
	}
}

export const populateUsersWithRoles = async (users: UserType[]) => {
	return Promise.all(users.map(populateUserWithRole))
}

export const findUser = async (userId: string) => {
	const user = await User.findById(userId).select('-password')

	if (!user) {
		throw new CustomError('User not found', 404)
	}

	return user
}

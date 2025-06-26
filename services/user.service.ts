import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import User from '../models/user.model.js'
import Role from '../models/role.model'
import CustomError from '../utils/custom-error'
import { CreateUserData, UserWithObjectRole } from '../types'
import { populateUserWithRole } from '../utils/user'
import { USER_ROLE } from '../utils/constants'

export const hashPassword = async (password: string): Promise<string> => {
	const salt = await bcrypt.genSalt(10)
	return bcrypt.hash(password, salt)
}

export const createUser = async (userData: CreateUserData, session?: mongoose.ClientSession) => {
	const { name, email, password, role } = userData

	if (!name || !email || !password) {
		throw new CustomError('Please provide all required fields', 400)
	}

	const existingUser = await User.findOne({ email })

	if (existingUser) {
		throw new CustomError('User already exists', 409)
	}

	const hashedPassword = await hashPassword(password)

	let userRole = await Role.findOne({ name: role || USER_ROLE })

	if (!userRole) {
		console.warn(`Role '${userData.role}' not found, assigning default 'user' role`)

		userRole = await Role.findOne({ name: USER_ROLE })

		if (!userRole) {
			throw new Error('Default user role not found in database')
		}
	}

	const user = (
		await User.create(
			[
				{
					name,
					email,
					password: hashedPassword,
					role: userRole._id
				}
			],
			{ session }
		)
	)[0] as UserWithObjectRole

	return await populateUserWithRole(user)
}

import User from '../models/user.model'
import { RequestHandler } from 'express'
import {
	GetUserParams,
	GetUserResponseBody,
	GetUsersResponseBody,
	ResponseBody,
	UserType,
	UserWithRole
} from '../types'
import CustomError from '../utils/custom-error'
import { findUser, populateUsersWithRoles, populateUserWithRole } from '../utils/user'
import { ADMIN_ROLE } from '../utils/constants'
import { createUser } from '../services/user.service'
import { hasPermissions } from '../utils/auth'
import Role from '../models/role.model'

export const getUsers: RequestHandler<unknown, GetUsersResponseBody> = async (req, res, next) => {
	try {
		const users = (await User.find().select('-password')) as UserType[]

		res.status(200).json({
			success: true,
			message: 'Users fetched successfully',
			data: await populateUsersWithRoles(users)
		})
	} catch (error) {
		next(error)
	}
}

export const getUser: RequestHandler<GetUserParams, GetUserResponseBody> = async (
	req,
	res,
	next
) => {
	try {
		const user = await findUser(req.params.id)
		const userRole = req.user?.role

		if (userRole !== ADMIN_ROLE && req.user?.id !== req.params.id) {
			throw new CustomError('You are not owner of this account', 401)
		}

		res.status(200).json({
			success: true,
			message: 'Users fetched successfully',
			data: await populateUserWithRole(user)
		})
	} catch (error) {
		next(error)
	}
}

export const createUserByAdmin: RequestHandler<
	unknown,
	ResponseBody<UserWithRole>,
	UserWithRole
> = async (req, res, next) => {
	try {
		const newUser = await createUser({ ...req.body })

		res.status(201).json({
			success: true,
			message: 'User created successfully',
			data: newUser
		})
	} catch (error) {
		next(error)
	}
}

export const updateUser: RequestHandler<{ id: string }, ResponseBody<UserWithRole>> = async (
	req,
	res,
	next
) => {
	try {
		const user = await findUser(req.params.id)

		if (!hasPermissions({ user: req.user, userId: user.id })) {
			throw new CustomError('You are not owner of this account', 401)
		}

		let role = user.role

		if (req.body.role) {
			role = (await Role.findOne({ name: req.body.role }))?.id ?? role
		}

		const updatedUser = await User.findByIdAndUpdate(
			req.params.id,
			{ ...req.body, role },
			{ new: true, overwrite: true }
		)

		res.status(200).json({
			success: true,
			message: 'User updated successfully',
			data: await populateUserWithRole(updatedUser)
		})
	} catch (error) {
		next(error)
	}
}

export const deleteUser: RequestHandler<{ id: string }, ResponseBody> = async (req, res, next) => {
	try {
		const user = await findUser(req.params.id)

		if (!hasPermissions({ user: req.user, userId: user.id })) {
			throw new CustomError('You are not owner of this account', 401)
		}

		await user.deleteOne()

		res.status(200).json({
			success: true,
			message: 'User deleted successfully'
		})
	} catch (error) {
		next(error)
	}
}

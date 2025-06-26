import { RequestHandler } from 'express'
import mongoose from 'mongoose'
import { ResponseBody, SignInRequestBody, SignUpInResponseBody, SignUpRequestBody } from '../types'
import CustomError from '../utils/custom-error'
import { clearAuthCookie, setAuthCookie } from '../utils/auth'
import { createUser } from '../services/user.service'
import { authenticateUser, generateToken } from '../services/auth.service'
import { USER_ROLE } from '../utils/constants'

export const signUp: RequestHandler<unknown, SignUpInResponseBody, SignUpRequestBody> = async (
	req,
	res,
	next
) => {
	const session = await mongoose.startSession()

	session.startTransaction()

	try {
		const newUser = await createUser({ ...req.body, role: USER_ROLE })

		await session.commitTransaction()

		const token = generateToken({
			userId: newUser._id as string,
			email: newUser.email
		})

		setAuthCookie(res, token).status(201).json({
			success: true,
			message: 'User created successfully',
			data: newUser
		})
	} catch (error) {
		await session.abortTransaction()

		next(error)
	} finally {
		await session.endSession()
	}
}

export const signIn: RequestHandler<unknown, SignUpInResponseBody, SignInRequestBody> = async (
	req,
	res,
	next
) => {
	try {
		const { email, password } = req.body

		const { user, token } = await authenticateUser({ email, password })

		setAuthCookie(res, token).status(200).json({
			success: true,
			message: 'User signed in successfully',
			data: user
		})
	} catch (error) {
		next(error)
	}
}

export const signOut: RequestHandler<unknown, ResponseBody> = async (req, res, next) => {
	try {
		if (!req.cookies.token) {
			throw new CustomError('User not signed in', 401)
		}

		clearAuthCookie(res).status(200).json({
			success: true,
			message: 'User signed out successfully'
		})
	} catch (error) {
		next(error)
	}
}

import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { StringValue } from 'ms'
import User from '../models/user.model.js'
import CustomError from '../utils/custom-error'
import { UserType, LoginCredentials, TokenPayload, AuthResult } from '../types'
import { populateUserWithRole } from '../utils/user'

const JWT_SECRET = process.env.JWT_SECRET!
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN! as StringValue

export const authenticateUser = async (credentials: LoginCredentials): Promise<AuthResult> => {
	const { email, password } = credentials

	const user = await User.findOne<UserType>({ email })

	if (!user) {
		throw new CustomError('Invalid credentials', 401)
	}

	const isValidPassword = await bcrypt.compare(password, user.password)

	if (!isValidPassword) {
		throw new CustomError('Invalid credentials', 401)
	}

	const token = generateToken({ userId: user._id as string, email: user.email })

	return { user: await populateUserWithRole(user), token }
}

export const generateToken = (payload: TokenPayload): string => {
	return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

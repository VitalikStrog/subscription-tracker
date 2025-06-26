import { Response } from 'express'
import { ADMIN_ROLE } from './constants'
import { UserWithRole } from '../types'

export const setAuthCookie = (res: Response, token: string): Response => {
	return res.cookie('token', token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'strict',
		maxAge: 24 * 60 * 60 * 1000 // 24 hours
	})
}

export const clearAuthCookie = (res: Response): Response => {
	return res.clearCookie('token', {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'strict'
	})
}

export const hasPermissions = ({
	user,
	userId,
	adminAccessible = true
}: {
	user?: UserWithRole
	userId: string
	adminAccessible?: boolean
}): boolean => {
	if (!user) {
		return false
	}

	return userId === user._id || (adminAccessible && user.role === ADMIN_ROLE)
}

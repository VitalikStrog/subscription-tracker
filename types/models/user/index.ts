import mongoose from 'mongoose'
import { RoleType, Roles } from '../role'

export interface UserType extends mongoose.Document {
	name: string
	email: string
	password: string
	role: mongoose.Types.ObjectId
}

export type UserWithObjectRole = Omit<UserType, 'role'> & { role: RoleType }

export type UserWithRole = Omit<UserType, 'role'> & { role: Roles }

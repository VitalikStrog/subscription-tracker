import mongoose from 'mongoose'

export type Roles = 'user' | 'admin'

export interface RoleType extends mongoose.Document {
	name: Roles
	description: string
	isSystem: boolean
}

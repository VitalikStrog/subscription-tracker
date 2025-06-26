import mongoose from 'mongoose'
import { RoleType } from '../types'

const roleSchema = new mongoose.Schema<RoleType>({
	name: {
		type: String,
		required: [true, 'Role Name is required'],
		trim: true,
		unique: true,
		minLength: 3,
		maxLength: 50,
		enum: ['user', 'admin']
	},
	description: {
		type: String,
		required: [true, 'Role description is required'],
		trim: true,
		minLength: 10,
		maxLength: 100
	},
	isSystem: {
		type: Boolean,
		default: false
	}
})

const Role = mongoose.model('Role', roleSchema)

export default Role

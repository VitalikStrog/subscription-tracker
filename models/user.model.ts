import mongoose from 'mongoose'
import { UserType } from '../types'
import { UserWithObjectRole } from '../types'

const userSchema = new mongoose.Schema<UserType | UserWithObjectRole>(
	{
		name: {
			type: String,
			required: [true, 'User Name is required'],
			trim: true,
			minLength: 3,
			maxLength: 50
		},
		email: {
			type: String,
			required: [true, 'Email is required'],
			unique: true,
			trim: true,
			lowercase: true,
			minLength: 5,
			maxLength: 255,
			match: [/\S+@\S+\.\S+/, 'Please fill a valid email address']
		},
		password: {
			type: String,
			required: [true, 'Password is required'],
			minLength: 6
		},
		role: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Role',
			required: true,
			index: true
		}
	},
	{
		timestamps: true
	}
)

const User = mongoose.model('User', userSchema)

export default User

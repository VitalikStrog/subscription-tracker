import mongoose from 'mongoose'
import Role from '../models/role.model.js'
import { ADMIN_ROLE, USER_ROLE } from '../utils/constants'

const DB_URI = process.env.DB_URI

if (!DB_URI) {
	throw new Error('Please define the MongoDB URI environment variable inside .env.local')
}

const initializeRoles = async () => {
	const existingRolesCount = await Role.countDocuments()

	if (existingRolesCount > 0) {
		console.log('✅ Roles already exist, skipping initialization')

		return
	}

	const predefinedRoles = [
		{
			name: USER_ROLE,
			description: 'Standard user role',
			isSystem: true
		},
		{
			name: ADMIN_ROLE,
			description: 'Administrator role',
			isSystem: true
		}
	]

	try {
		console.log('Initializing roles...')

		for (const roleData of predefinedRoles) {
			const result = await Role.findOneAndUpdate({ name: roleData.name }, roleData, {
				upsert: true,
				new: true,
				setDefaultsOnInsert: true
			})

			console.log(`Role '${result.name}' ${result.isNew ? 'created' : 'updated'}`)
		}

		console.log('✅ Roles initialized successfully')
	} catch (error) {
		console.error('❌ Error initializing roles:', error)
		throw error
	}
}

const connectToDatabase = async () => {
	try {
		await mongoose.connect(DB_URI, {
			serverSelectionTimeoutMS: 5000
		})

		console.log('✅ MongoDB Connected...')

		await initializeRoles()

		return true
	} catch (error) {
		console.error('❌ Error connecting to MongoDB:', error)

		if (process.env.NODE_ENV === 'production') {
			process.exit(1)
		} else {
			throw error
		}
	}
}

mongoose.connection.on('error', (error) => {
	console.error('MongoDB connection error:', error)
})

mongoose.connection.on('disconnected', () => {
	console.warn('⚠️ MongoDB disconnected')
})

mongoose.connection.on('reconnected', () => {
	console.log('✅ MongoDB reconnected')
})

process.on('SIGINT', async () => {
	try {
		await mongoose.connection.close()
		console.log('MongoDB connection closed through app termination')
		process.exit(0)
	} catch (error) {
		console.error('Error during graceful shutdown:', error)
		process.exit(1)
	}
})

export default connectToDatabase

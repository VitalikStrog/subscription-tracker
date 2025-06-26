import mongoose from 'mongoose'
import { UserType } from '../user'

export type renewalPeriods = 'daily' | 'weekly' | 'monthly' | 'yearly'

export interface ISubscription extends mongoose.Document {
	name: string
	price: number
	currency?: string
	frequency?: renewalPeriods
	category: string
	paymentMethod: string
	status: 'active' | 'cancelled' | 'expired'
	startDate: Date
	renewalDate?: Date
	user: mongoose.Types.ObjectId
}

export type SubscriptionWithUser = Omit<ISubscription, 'user'> & { user: UserType }

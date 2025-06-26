import mongoose from 'mongoose'
import { ISubscription, renewalPeriods } from '../types'

const subscriptionSchema = new mongoose.Schema<ISubscription>(
	{
		name: {
			type: String,
			required: [true, 'Subscription name is required'],
			trim: true,
			minLength: 2,
			maxLength: 100
		},
		price: {
			type: Number,
			required: [true, 'Subscription price is required'],
			min: [0, 'Subscription price must be greater than 0']
		},
		currency: {
			type: String,
			enum: ['USD', 'EUR', 'GBP'],
			default: 'USD'
		},
		frequency: {
			type: String,
			enum: ['daily', 'weekly', 'monthly', 'yearly'],
			default: 'monthly'
		},
		category: {
			type: String,
			enum: [
				'sports',
				'news',
				'entertainment',
				'lifestyle',
				'technology',
				'finance',
				'politics',
				'other'
			],
			required: [true, 'Subscription category is required']
		},
		paymentMethod: {
			type: String,
			required: true,
			trim: true
		},
		status: {
			type: String,
			enum: ['active', 'cancelled', 'expired'],
			default: 'active'
		},
		startDate: {
			type: Date,
			required: true,
			validate: {
				validator: (value: Date) => value <= new Date(),
				message: 'Start date must be in the past'
			}
		},
		renewalDate: {
			type: Date,
			validate: {
				validator: function (value: Date) {
					return value > this.startDate
				},
				message: 'Renewal date must be after the start date'
			}
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
			index: true
		}
	},
	{
		timestamps: true
	}
)

subscriptionSchema.pre('save', function (next) {
	if (!this.renewalDate) {
		const renewalPeriods: Record<renewalPeriods, number> = {
			daily: 1,
			weekly: 7,
			monthly: 30,
			yearly: 365
		}

		const startDate = new Date(this.startDate)
		const daysToAdd = renewalPeriods[this.frequency || 'monthly']

		this.renewalDate = new Date(startDate.getTime() + daysToAdd * 24 * 60 * 60 * 1000)
	}

	if (this.renewalDate < new Date()) {
		this.status = 'expired'
	}

	next()
})

const Subscription = mongoose.model('Subscription', subscriptionSchema)

export default Subscription

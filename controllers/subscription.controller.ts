import { RequestHandler } from 'express'
import Subscription from '../models/subscription.model'
import { ISubscription, ResponseBody } from '../types'
import CustomError from '../utils/custom-error'
import workflowClient from '../config/upstash'
import { hasPermissions } from '../utils/auth'
import { ADMIN_ROLE } from '../utils/constants'

export const getAllSubscriptions: RequestHandler<unknown, ResponseBody<ISubscription[]>> = async (
	req,
	res,
	next
) => {
	try {
		const subscriptions = await Subscription.find()

		res.status(200).json({
			success: true,
			message: 'Subscriptions fetched successfully',
			data: subscriptions
		})
	} catch (error) {
		next(error)
	}
}

export const getSubscription: RequestHandler<{ id: string }, ResponseBody<ISubscription>> = async (
	req,
	res,
	next
) => {
	try {
		const subscription = await Subscription.findById(req.params.id)

		if (!subscription) {
			throw new CustomError('Subscription not found', 404)
		}

		const userId = subscription.user.toString()

		if (!hasPermissions({ user: req.user, userId })) {
			throw new CustomError('You are not owner of this subscription', 401)
		}

		res.status(200).json({
			success: true,
			message: 'Subscription fetched successfully',
			data: subscription
		})
	} catch (error) {
		next(error)
	}
}

export const createSubscription: RequestHandler<
	unknown,
	ResponseBody<ISubscription> & { workflowRunId: string },
	ISubscription
> = async (req, res, next) => {
	try {
		const subscription = await Subscription.create({ ...req.body, user: req.user?._id })

		const { workflowRunId } = await workflowClient.trigger({
			url: `${process.env.SERVER_URL}/api/v1/workflows/subscription/reminder`,
			body: {
				subscriptionId: subscription.id
			},
			headers: {
				'content-type': 'application/json'
			},
			retries: 0
		})

		res.status(201).json({
			success: true,
			message: 'Subscription created successfully',
			data: subscription,
			workflowRunId
		})
	} catch (error) {
		next(error)
	}
}

export const getUsersSubscriptions: RequestHandler<
	{ id: string },
	ResponseBody<ISubscription[]>
> = async (req, res, next) => {
	try {
		if (!hasPermissions({ user: req.user, userId: req.params.id })) {
			throw new CustomError('You are not owner of this account', 401)
		}

		const subscriptions = await Subscription.find({ user: req.params.id })

		res.status(200).json({
			success: true,
			message: 'Subscriptions fetched successfully',
			data: subscriptions
		})
	} catch (error) {
		next(error)
	}
}

export const updateSubscription: RequestHandler<
	{ id: string },
	ResponseBody<ISubscription | null>,
	ISubscription
> = async (req, res, next) => {
	try {
		const subscription = await Subscription.findById(req.params.id)

		if (!subscription) {
			throw new CustomError('Subscription not found', 404)
		}

		const userId = subscription.user.toString()

		if (!hasPermissions({ user: req.user, userId, adminAccessible: false })) {
			throw new CustomError('You are not owner of this subscription', 401)
		}

		const updatedSubscription = await Subscription.findByIdAndUpdate(
			req.params.id,
			{ ...req.body },
			{ new: true, overwrite: true }
		)

		res.status(200).json({
			success: true,
			message: 'Subscription updated successfully',
			data: updatedSubscription
		})
	} catch (error) {
		next(error)
	}
}

export const deleteSubscription: RequestHandler<{ id: string }, ResponseBody<string>> = async (
	req,
	res,
	next
) => {
	try {
		const subscription = await Subscription.findById(req.params.id)

		if (!subscription) {
			throw new CustomError('Subscription not found', 404)
		}

		await subscription.deleteOne()

		res.status(200).json({
			success: true,
			message: 'Subscription deleted successfully',
			data: subscription.id
		})
	} catch (error) {
		next(error)
	}
}

export const cancelSubscription: RequestHandler<
	{ id: string },
	ResponseBody<ISubscription>
> = async (req, res, next) => {
	try {
		const subscription = await Subscription.findById(req.params.id)

		if (!subscription) {
			throw new CustomError('Subscription not found', 404)
		}

		if (subscription.status === 'cancelled') {
			throw new CustomError('Subscription is already cancelled', 400)
		}

		const userId = subscription.user.toString()

		if (!hasPermissions({ user: req.user, userId, adminAccessible: false })) {
			throw new CustomError('You are not owner of this subscription', 401)
		}

		subscription.status = 'cancelled'

		await subscription.save()

		res.status(200).json({
			success: true,
			message: 'Subscription cancelled successfully',
			data: subscription
		})
	} catch (error) {
		next(error)
	}
}

export const getUpcomingSubscriptions: RequestHandler = async (req, res, next) => {
	try {
		const sevenDaysFromNow = new Date()
		sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7)

		const userRole = req.user?.role

		const upcomingSubscriptions = await Subscription.find({
			...(userRole !== ADMIN_ROLE && { user: req.user?._id }),
			status: 'active',
			renewalDate: {
				$gte: new Date(),
				$lte: sevenDaysFromNow
			}
		})
			.populate('user', 'name email')
			.sort({ renewalDate: 1 })

		res.status(200).json({
			success: true,
			message: 'Upcoming renewals retrieved successfully',
			data: upcomingSubscriptions
		})
	} catch (error) {
		next(error)
	}
}

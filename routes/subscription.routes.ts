import { Router } from 'express'
import authorize from '../middlewares/auth.middleware'
import {
	cancelSubscription,
	createSubscription,
	deleteSubscription,
	getAllSubscriptions,
	getSubscription,
	getUpcomingSubscriptions,
	getUsersSubscriptions,
	updateSubscription
} from '../controllers/subscription.controller'
import requireRole from '../middlewares/require-role.middleware'
import { ADMIN_ROLE } from '../utils/constants'

const subscriptionRouter = Router()

subscriptionRouter.get('/', authorize, requireRole(ADMIN_ROLE), getAllSubscriptions)

subscriptionRouter.get('/upcoming-renewals', authorize, getUpcomingSubscriptions)

subscriptionRouter.get('/:id', authorize, getSubscription)

subscriptionRouter.post('/', authorize, createSubscription)

subscriptionRouter.put('/:id', authorize, updateSubscription)

subscriptionRouter.delete('/:id', authorize, requireRole(ADMIN_ROLE), deleteSubscription)

subscriptionRouter.get('/user/:id', authorize, getUsersSubscriptions)

subscriptionRouter.post('/:id/cancel', authorize, cancelSubscription)

export default subscriptionRouter

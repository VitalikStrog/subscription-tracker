import { WorkflowContext } from '@upstash/workflow'
import Subscription from '../models/subscription.model'
import { Dayjs } from 'dayjs'
import { ContextPayload } from '../types/controllers/workflow'
import { sendReminderEmail } from './send-email'
import { SubscriptionWithUser } from '../types'
import { EmailTemplate } from './email-template'

export const REMINDERS = [7, 5, 2, 1]

export const fetchSubscriptions = async (
	context: WorkflowContext<ContextPayload>,
	subscriptionId: string
) => {
	return await context.run('get subscription', async () => {
		return Subscription.findById<SubscriptionWithUser>(subscriptionId).populate(
			'user',
			'name email'
		)
	})
}

export const sleepUntilReminder = async (
	context: WorkflowContext<ContextPayload>,
	label: string,
	date: Dayjs
) => {
	console.log(`Sleeping until ${label} reminder at ${date}`)

	await context.sleepUntil(label, date.toDate())
}

export const triggerReminder = async (
	context: WorkflowContext<ContextPayload>,
	label: EmailTemplate,
	subscription: SubscriptionWithUser
) => {
	await context.run(label, async () => {
		console.log(`Triggering ${label} reminder`)

		await sendReminderEmail({
			to: subscription.user.email,
			type: label,
			subscription
		})
	})
}

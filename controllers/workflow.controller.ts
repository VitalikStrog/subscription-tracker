import dayjs from 'dayjs'
import { createRequire } from 'module'
import { ContextPayload } from '../types/controllers/workflow'
import {
	fetchSubscriptions,
	sleepUntilReminder,
	triggerReminder,
	REMINDERS
} from '../utils/workflow'
import { WorkflowContext } from '@upstash/workflow'
import { EmailTemplate } from '../utils/email-template'
import { RequestHandler } from 'express'

const require = createRequire(import.meta.url)
const { serve: importedServe } = require('@upstash/workflow/express')

type ServeFunction = (
	routeFunction: (context: WorkflowContext<ContextPayload>) => Promise<unknown>
) => RequestHandler

const serve = importedServe as ServeFunction

const reminderWorkflow = async (context: WorkflowContext<ContextPayload>) => {
	const { subscriptionId } = context.requestPayload

	const subscription = await fetchSubscriptions(context, subscriptionId)

	if (!subscription || ['active', 'cancelled'].includes(subscription.status)) {
		return
	}

	const renewalDate = dayjs(subscription.renewalDate)

	if (renewalDate.isBefore(dayjs())) {
		console.log(
			`Renewal date has passed for subscription: ${subscriptionId} or it's been cancelled. Stopping workflow.`
		)

		return
	}

	for (const daysBefore of REMINDERS) {
		const reminderDate = renewalDate.subtract(daysBefore, 'day')
		const emailTemplate = `${daysBefore} days` as EmailTemplate
		const label = `Reminder ${emailTemplate} before`

		if (reminderDate.isAfter(dayjs())) {
			await sleepUntilReminder(context, label, reminderDate)
		}

		if (dayjs().isSame(reminderDate, 'days')) {
			const refetchedSubscription = await fetchSubscriptions(context, subscriptionId)

			if (!refetchedSubscription || ['active', 'cancelled'].includes(subscription.status)) {
				break
			}

			await triggerReminder(context, emailTemplate, refetchedSubscription)
		}
	}
}

export const sendReminders = serve(reminderWorkflow)

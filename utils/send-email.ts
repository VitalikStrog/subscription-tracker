import { EmailTemplate, emailTemplates } from './email-template'
import { EmailData, SubscriptionWithUser } from '../types'
import transporter from '../config/nodemailer'
import dayjs from 'dayjs'

export const sendReminderEmail = async ({
	to,
	type,
	subscription
}: {
	to: string
	type: EmailTemplate
	subscription: SubscriptionWithUser
}) => {
	if (!to || !type) {
		throw new Error('Missing required parameters')
	}

	const template = emailTemplates[type]

	if (!template) {
		throw new Error('Invalid email type')
	}

	const mailInfo: EmailData = {
		userName: subscription.user.name,
		subscriptionName: subscription.name,
		renewalDate: dayjs(subscription.renewalDate).format('MMM D, YYYY'),
		planName: subscription.name,
		price: `${subscription.currency}${subscription.price} (${subscription.frequency})`,
		paymentMethod: subscription.paymentMethod
	}

	const message = template.generateBody(mailInfo)
	const subject = template.generateSubject(mailInfo)

	const mailOptions = {
		from: process.env.EMAIL_USER,
		to: to,
		subject,
		html: message
	}

	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			console.log('Error sending email: ' + error)
		} else {
			console.log('Email sent: ' + info.response)
		}
	})
}

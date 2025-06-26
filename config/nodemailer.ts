import nodemailer from 'nodemailer'

const { EMAIL_USER, EMAIL_PASSWORD } = process.env

if (!EMAIL_USER || !EMAIL_PASSWORD) {
	throw new Error(
		'Please define the email user and password environment variables inside .env.local'
	)
}

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASSWORD
	}
})

export default transporter

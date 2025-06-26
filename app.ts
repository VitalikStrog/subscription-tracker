import express from 'express'
import cookieParser from 'cookie-parser'
import authRouter from './routes/auth.routes'
import userRouter from './routes/user.routes'
import subscriptionRouter from './routes/subscription.routes'
import workflowRouter from './routes/workflow.routes'
import connectToDatabase from './database/mongodb'
import errorMiddleware from './middlewares/error.middleware'
import arcjetMiddleware from './middlewares/arcjet.middleware'

const PORT = process.env.PORT || 3000

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(arcjetMiddleware)

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/subscriptions', subscriptionRouter)
app.use('/api/v1/workflows', workflowRouter)

app.get('/', (req, res) => {
	res.send('Welcome to the Subscription Tracker API!')
})

app.use(errorMiddleware)

app.listen(PORT, async () => {
	console.log(`Subscription Tracker is running on host http://localhost:${PORT}`)

	await connectToDatabase()
})

export default app

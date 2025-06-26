import { Request, Response, NextFunction } from 'express'
import aj from '../config/arcjet'

const arcjetMiddleware = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const decision = await aj.protect(req, { requested: 1 })

		if (decision.isDenied()) {
			if (decision.reason.isRateLimit()) {
				res.status(429).json({ error: 'Too many requests' })

				return
			}

			if (decision.reason.isBot()) {
				res.status(403).json({ error: 'Bot detected' })

				return
			}

			res.status(403).json({ error: 'Access denied' })

			return
		}

		next()
	} catch (error) {
		console.error(`Arcjet Middleware Error: ${error}`)

		next(error)
	}
}

export default arcjetMiddleware

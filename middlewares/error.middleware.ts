import { NextFunction, Request, Response } from 'express'
import { ErrorType } from '../types'
import CustomError from '../utils/custom-error'

const errorMiddleware = (err: ErrorType, req: Request, res: Response, next: NextFunction): void => {
	try {
		let error

		if (err instanceof CustomError) {
			error = err
		} else {
			error = { ...err }
		}

		console.error(err)

		// Mongoose bad ObjectId
		if ('name' in err && err.name === 'CastError') {
			error = new CustomError('Resource not found.', 404)
		}

		// Mongoose duplicate key
		if ('code' in err && err.code === 11000) {
			error = new CustomError('Duplicate field value entered.', 400)
		}

		// Mongoose validation error
		if (err.name === 'ValidationError' && 'errors' in err && err.errors) {
			const message = Object.values(err.errors).map((el) => el?.message)
			error = new CustomError(message.join('. '), 400)
		}

		res.status(error.statusCode || 500).json({
			success: false,
			error: error.message || 'Server error'
		})
	} catch (error) {
		next(error)
	}
}

export default errorMiddleware

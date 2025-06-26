import { Router } from 'express'
import {
	createUserByAdmin,
	deleteUser,
	getUser,
	getUsers,
	updateUser
} from '../controllers/user.controller'
import authorize from '../middlewares/auth.middleware'
import requireRole from '../middlewares/require-role.middleware'
import { ADMIN_ROLE } from '../utils/constants'

const userRouter = Router()

userRouter.get('/', authorize, requireRole(ADMIN_ROLE), getUsers)

userRouter.get('/:id', authorize, getUser)

userRouter.post('/', authorize, requireRole(ADMIN_ROLE), createUserByAdmin)

userRouter.put('/:id', authorize, updateUser)

userRouter.delete('/:id', authorize, deleteUser)

export default userRouter

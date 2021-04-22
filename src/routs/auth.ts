import express from 'express'
import login from '../controllers/auth/login'
import refreshToken from '../controllers/auth/refreshToken' 
import changePassword from '../controllers/auth/changePassword'

const router = express.Router()

router.post('/login', login) //api/auth/login
router.put('/changePassword', changePassword) //api/auth/changePassword
router.post('/refreshToken', refreshToken) //api/auth/refreshToken

export default router;
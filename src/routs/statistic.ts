import express from 'express'
import getPlan from '../controllers/statistic/getPlan'

const router = express.Router()

router.get('/plan', getPlan) //api/plan/

export default router;
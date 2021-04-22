import express from 'express'
import getPlan from '../controllers/plan/getPlan'
import postPlan from '../controllers/plan/postPlan'
import putPlan from '../controllers/plan/putPlan'
import deletePlan from '../controllers/plan/deletePlan'

const router = express.Router()

router.get('', getPlan) //api/plan/
router.post('', postPlan) //api/plan/
router.put('', putPlan) //api/plan/
router.delete('', deletePlan) //api/plan/

export default router;